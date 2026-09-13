'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, CheckIcon, Loader2 } from 'lucide-react';
import { MessageInfo, MessagePosition } from '@/types/post';
import { Board as BoardConfig } from '@/types';
import {
    createMessage,
    updateMessagePosition,
    updateMessage,
    deleteOwnMessage,
    getOwnedMessageIDs,
} from '@/lib/api/message';
import { getVisitorToken } from '@/lib/visitor';
import Note from './Note';
import QuestionModal from './QuestionModal';
import MessageInputModal from './MessageInputModal';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from '@/components/ui/toast';
import { useMessageDrag } from './useMessageDrag';

interface BoardProps {
    initialMessages: MessageInfo[];
    boardSettings?: BoardConfig;
}

type Step = 'idle' | 'question' | 'input' | 'positioning';

export default function Board({ initialMessages, boardSettings }: BoardProps) {
    const router = useRouter();
    const messagesLayerRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<MessageInfo[]>(initialMessages);
    const [visitorToken, setVisitorToken] = useState('');
    const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());

    const messagesRef = useRef(messages);
    const visitorTokenRef = useRef(visitorToken);
    useEffect(() => { messagesRef.current = messages; }, [messages]);
    useEffect(() => { visitorTokenRef.current = visitorToken; }, [visitorToken]);

    // Sync state with props（ISR 刷新后拿到的新列表）
    useEffect(() => { setMessages(initialMessages); }, [initialMessages]);

    // 从未定位过的旧留言（x/y/z 均为 0）按容器实际尺寸自动排布，行距不够时压缩而不是重叠
    const [legacyLayout, setLegacyLayout] = useState<Record<string, { left: number; top: number }>>({});
    useEffect(() => {
        const layer = messagesLayerRef.current;
        if (!layer) return;
        const legacy = initialMessages.filter(m => m.position.x === 0 && m.position.y === 0 && m.position.z === 0);
        if (legacy.length === 0) {
            setLegacyLayout({});
            return;
        }
        const NOTE_W = 256, NOTE_H = 240, GAP = 20, MARGIN = 8;
        const compute = () => {
            const w = layer.clientWidth, h = layer.clientHeight;
            if (w <= 0 || h <= 0) return;
            const cols = Math.max(1, Math.floor((w - 2 * MARGIN + GAP) / (NOTE_W + GAP)));
            const rows = Math.ceil(legacy.length / cols);
            const stepX = cols > 1 ? Math.min(NOTE_W + GAP, (w - 2 * MARGIN - NOTE_W) / (cols - 1)) : 0;
            const stepY = rows > 1 ? Math.min(NOTE_H + GAP, (h - 2 * MARGIN - NOTE_H) / (rows - 1)) : 0;
            const map: Record<string, { left: number; top: number }> = {};
            legacy.forEach((m, i) => {
                map[m.id] = {
                    left: ((MARGIN + (i % cols) * stepX) / w) * 100,
                    top: ((MARGIN + Math.floor(i / cols) * stepY) / h) * 100,
                };
            });
            setLegacyLayout(map);
        };
        compute();
        const observer = new ResizeObserver(compute);
        observer.observe(layer);
        return () => observer.disconnect();
    }, [initialMessages]);

    // Initialize visitor token and owned IDs (one-time load)
    useEffect(() => {
        (async () => {
            const token = await getVisitorToken();
            setVisitorToken(token);
            if (token) {
                const ids = await getOwnedMessageIDs(token);
                setOwnedIds(new Set(ids));
            }
        })();
    }, []);

    // useCallback + 仅依赖 ref：保持引用稳定，使依赖它的回调不会随渲染重建
    const ensureVisitorToken = useCallback(async (): Promise<string> => {
        let token = visitorTokenRef.current;
        if (!token || token.split('.').length !== 3) {
            token = await getVisitorToken();
            if (token) setVisitorToken(token);
        }
        return token;
    }, []);

    const toServerPosition = (pos: MessagePosition): MessagePosition => ({
        x: Math.round(pos.x),
        y: Math.round(pos.y),
        z: Math.round(pos.z),
    });

    // Interaction States
    const [step, setStep] = useState<Step>('idle');
    const [questionAnswer, setQuestionAnswer] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit own message state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Drag engine: existing notes + temp note positioning
    const onCommitPosition = async (msg: MessageInfo) => {
        const token = await ensureVisitorToken();
        if (!token) {
            toast('error', '访客身份初始化失败，请刷新后重试');
            return;
        }
        const ok = await updateMessagePosition({
            id: msg.id,
            position: toServerPosition(msg.position),
            visitor_token: token,
        });
        if (!ok) toast('error', '保存便签位置失败，请重试');
    };
    const drag = useMessageDrag({
        layerRef: messagesLayerRef,
        messagesRef,
        setMessages,
        canDrag: (id) => ownedIds.has(id),
        onCommit: onCommitPosition,
    });

    const handleStart = () => {
        if (boardSettings?.question) {
            setStep('question');
            setQuestionAnswer('');
        } else {
            setStep('input');
        }
    };

    const handleQuestionSubmit = () => {
        if (!questionAnswer.trim()) return;
        setStep('input');
    };

    const handleInputSubmit = () => {
        if (!newMessage.trim()) return;
        setStep('positioning');
        const maxZ = messages.reduce((max, m) => Math.max(max, m.position.z), 0);
        drag.setTempPosition(prev => ({ ...prev, z: maxZ + 1 }));
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        if (boardSettings?.question?.trim() && !questionAnswer.trim()) {
            setStep('question');
            setIsSubmitting(false);
            return;
        }
        const token = await ensureVisitorToken();
        if (!token) {
            toast('error', '访客身份初始化失败，请刷新后重试');
            setIsSubmitting(false);
            return;
        }

        const result = await createMessage({
            content: newMessage,
            position: toServerPosition(drag.tempPosition),
            visitor_token: token,
            ...(boardSettings?.question?.trim() ? { board_answer: questionAnswer.trim() } : {}),
        });

        if (result.ok) {
            setStep('idle');
            setNewMessage('');
            router.refresh();
            const ids = await getOwnedMessageIDs(token);
            setOwnedIds(new Set(ids));
            if (boardSettings?.need_reviewed) {
                toast('info', '留言提交成功，审核通过后才会显示');
            } else {
                toast('success', '留言发布成功！');
            }
        } else if (result.message && result.message.includes('Incorrect answer')) {
            setQuestionAnswer('');
            setStep('question');
            toast('error', '答案不正确，请重新回答');
        } else {
            toast('error', result.message || '留言发布失败，请重试');
        }
        setIsSubmitting(false);
    };

    // 编辑 / 删除自己的留言（读 ref 而非 state，保持引用稳定以便 Note memo 生效）
    const openEdit = useCallback((id: string) => {
        const msg = messagesRef.current.find(m => m.id === id);
        if (!msg) return;
        setEditingId(id);
        setEditingContent(msg.content);
    }, []);

    const saveEdit = async () => {
        if (!editingId) return;
        setIsSavingEdit(true);
        const token = await ensureVisitorToken();
        if (!token) {
            toast('error', '访客身份初始化失败，请刷新后重试');
            setIsSavingEdit(false);
            return;
        }
        const msg = messages.find(m => m.id === editingId);
        if (!msg) {
            setIsSavingEdit(false);
            return;
        }
        const ok = await updateMessage({
            id: editingId,
            content: editingContent,
            position: toServerPosition(msg.position),
            visitor_token: token,
        });
        setIsSavingEdit(false);
        if (ok) {
            setEditingId(null);
            setEditingContent('');
            toast('success', '留言已更新');
            router.refresh();
        } else {
            toast('error', '更新留言失败，请重试');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingContent('');
    };

    const removeMessage = useCallback(async (id: string) => {
        const token = await ensureVisitorToken();
        if (!token) {
            toast('error', '访客身份初始化失败，请刷新后重试');
            return;
        }
        if (!window.confirm('确定删除这条留言吗？删除后无法恢复。')) return;
        const ok = await deleteOwnMessage({ id, visitor_token: token });
        if (ok) {
            toast('success', '留言已删除');
            router.refresh();
        } else {
            toast('error', '删除留言失败，请重试');
        }
    }, [ensureVisitorToken, router]);

    return (
        <div
            className="relative h-[80vh] bg-[#fdf5e6] rounded-xl border-8 border-[#8B4513] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] overflow-hidden select-none"
        >
            {/* Cork texture pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0"
                 style={{
                     backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%238B4513\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1v1H5V0zM0 5h1v1H0V5z\'/%3E%3C/g%3E%3C/svg%3E")'
                 }}>
            </div>

            <div className="relative z-10 w-full h-full p-4 md:p-10">
                <div className="flex justify-between items-center mb-6 pointer-events-none">
                    <h2 className="text-3xl font-bold text-[#5d4037] drop-shadow-sm font-serif pointer-events-auto">
                        留言板
                        {messages.length > 0 && (
                            <span className="ml-3 align-middle text-sm font-normal text-[#8d6e63]">共 {messages.length} 条</span>
                        )}
                    </h2>
                    <div className="text-[#8d6e63] text-sm hidden sm:block pointer-events-auto">
                        {step === 'positioning' ? '拖动便签到合适的位置，然后点确认！' : '把你的想法钉在这里！'}
                    </div>
                </div>

                {/* Messages Layer */}
                <div ref={messagesLayerRef} className="absolute inset-0 top-20 pointer-events-none">
                    {step === 'idle' && messages.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="border-2 border-dashed border-[#8d6e63]/40 rounded-xl px-8 py-6 text-center text-[#5d4037]/70 bg-white/30">
                                <p className="text-lg font-medium">还没有留言</p>
                                <p className="text-sm mt-1">点击右下角的 ＋ 钉下第一条便签吧！</p>
                            </div>
                        </div>
                    )}
                    {messages.map((msg, idx) => {
                        // 从未定位过的旧留言（x/y/z 均为 0）使用按容器尺寸计算的排布
                        const isLegacy = msg.position.x === 0 && msg.position.y === 0 && msg.position.z === 0;
                        const fallbackLeft = (idx % 4) * 20 + 5;
                        const fallbackTop = Math.floor(idx / 4) * 25 + 5;
                        const legacyPos = legacyLayout[msg.id] ?? { left: fallbackLeft, top: fallbackTop };
                        const left = (isLegacy ? legacyPos.left : msg.position.x) + '%';
                        const top = (isLegacy ? legacyPos.top : msg.position.y) + '%';

                        const canDrag = ownedIds.has(msg.id);
                        const isDragging = drag.draggingId === msg.id;

                        return (
                            <div
                                key={msg.id}
                                className={`absolute pointer-events-auto touch-none ${canDrag ? 'cursor-move' : 'cursor-default'} ${isDragging ? '' : 'transition-all duration-75 ease-out'}`}
                                style={{
                                    left,
                                    top,
                                    zIndex: msg.position.z,
                                }}
                                onPointerDown={(e) => drag.handleNoteMouseDown(e, msg)}
                            >
                                <Note
                                    message={msg}
                                    index={idx}
                                    owned={canDrag}
                                    dragging={isDragging}
                                    onEdit={openEdit}
                                    onDelete={removeMessage}
                                />
                            </div>
                        );
                    })}
                    {step === 'positioning' && (
                        <div
                            className="absolute z-50 cursor-move pointer-events-auto touch-none"
                            style={{
                                left: `${drag.tempPosition.x}%`,
                                top: `${drag.tempPosition.y}%`,
                            }}
                            onPointerDown={drag.handleTempMouseDown}
                        >
                            <div className="relative">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                    拖到合适的位置，然后点确认！
                                </div>
                                <Note
                                    message={{
                                        id: 'temp',
                                        content: newMessage,
                                        position: drag.tempPosition,
                                        state: { view: 0, like: 0, length: 0, status: 'draft' },
                                        time: { created_at: new Date().toISOString(), updated_at: '' },
                                    }}
                                    index={999}
                                    dragging={drag.isDraggingTemp}
                                />

                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="bg-white/90 hover:bg-white shadow-lg text-red-600"
                                        onClick={() => setStep('input')}
                                    >
                                        返回
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 shadow-lg text-white"
                                        onClick={handleFinalSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
                                        确认
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            {step === 'idle' && (
                <Button
                    onClick={handleStart}
                    className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl bg-amber-600 hover:bg-amber-700 text-white z-[9000] transition-all hover:scale-110"
                    size="icon"
                    title="写一条留言"
                    aria-label="写一条留言"
                >
                    <PlusIcon className="w-8 h-8" />
                </Button>
            )}

            {/* Question Modal */}
            {step === 'question' && (
                <QuestionModal
                    question={boardSettings?.question || ''}
                    value={questionAnswer}
                    onChange={setQuestionAnswer}
                    onSubmit={handleQuestionSubmit}
                    onCancel={() => setStep('idle')}
                />
            )}

            {/* Input Modal */}
            {step === 'input' && (
                <MessageInputModal
                    title="Write Message"
                    value={newMessage}
                    onChange={setNewMessage}
                    onSubmit={handleInputSubmit}
                    onCancel={() => setStep('idle')}
                    submitDisabled={!newMessage.trim()}
                />
            )}

            {/* Edit Modal */}
            {editingId && (
                <MessageInputModal
                    title="编辑留言"
                    value={editingContent}
                    onChange={setEditingContent}
                    onSubmit={saveEdit}
                    onCancel={cancelEdit}
                    submitLabel="保存"
                    submitting={isSavingEdit}
                />
            )}

            {/* 全局 toast 提示 */}
            <Toaster />
        </div>
    );
}
