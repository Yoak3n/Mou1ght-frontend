'use client';

import { useEffect, useRef, useState } from 'react';
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

    const ensureVisitorToken = async (): Promise<string> => {
        let token = visitorTokenRef.current;
        if (!token || token.split('.').length !== 3) {
            token = await getVisitorToken();
            if (token) setVisitorToken(token);
        }
        return token;
    };

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
            alert('Failed to initialize visitor identity. Please refresh and try again.');
            return;
        }
        const ok = await updateMessagePosition({
            id: msg.id,
            position: toServerPosition(msg.position),
            visitor_token: token,
        });
        if (!ok) alert('Failed to save note position. Please try again.');
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
            alert('Failed to initialize visitor identity. Please refresh and try again.');
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
                alert('Message submitted successfully! It will appear after review.');
            }
        } else if (result.message && result.message.includes('Incorrect answer')) {
            setQuestionAnswer('');
            setStep('question');
            alert('答案不正确，请重新回答');
        } else {
            alert(result.message || 'Failed to post message. Please try again.');
        }
        setIsSubmitting(false);
    };

    // Edit / delete own message
    const openEdit = (id: string) => {
        const msg = messages.find(m => m.id === id);
        if (!msg) return;
        setEditingId(id);
        setEditingContent(msg.content);
    };

    const saveEdit = async () => {
        if (!editingId) return;
        setIsSavingEdit(true);
        const token = await ensureVisitorToken();
        if (!token) {
            alert('Failed to initialize visitor identity. Please refresh and try again.');
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
            router.refresh();
        } else {
            alert('Failed to update message. Please try again.');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingContent('');
    };

    const removeMessage = async (id: string) => {
        const token = await ensureVisitorToken();
        if (!token) {
            alert('Failed to initialize visitor identity. Please refresh and try again.');
            return;
        }
        if (!window.confirm('确定删除这条留言吗？删除后无法恢复。')) return;
        const ok = await deleteOwnMessage({ id, visitor_token: token });
        if (ok) {
            router.refresh();
        } else {
            alert('Failed to delete message. Please try again.');
        }
    };

    return (
        <div
            className="relative h-[80vh] bg-[#fdf5e6] rounded-xl border-8 border-[#8B4513] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] overflow-hidden select-none"
            onMouseMove={drag.handleMouseMove}
        >
            {/* Cork texture pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0"
                 style={{
                     backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%238B4513\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1v1H5V0zM0 5h1v1H0V5z\'/%3E%3C/g%3E%3C/svg%3E")'
                 }}>
            </div>

            <div className="relative z-10 w-full h-full p-4 md:p-10">
                <div className="flex justify-between items-center mb-6 pointer-events-none">
                    <h2 className="text-3xl font-bold text-[#5d4037] drop-shadow-sm font-serif pointer-events-auto">Bulletin Board</h2>
                    <div className="text-[#8d6e63] text-sm hidden sm:block pointer-events-auto">
                        {step === 'positioning' ? 'Drag your note to position it, then confirm!' : 'Pin your thoughts here!'}
                    </div>
                </div>

                {/* Messages Layer */}
                <div ref={messagesLayerRef} className="absolute inset-0 top-20 pointer-events-none">
                    {messages.map((msg, idx) => {
                        // 从未定位过的旧留言（x/y/z 均为 0）按索引自动排布
                        const isLegacy = msg.position.x === 0 && msg.position.y === 0 && msg.position.z === 0;
                        const left = isLegacy ? ((idx % 4) * 20 + 5) + '%' : msg.position.x + '%';
                        const top = isLegacy ? (Math.floor(idx / 4) * 25 + 5) + '%' : msg.position.y + '%';

                        const canDrag = ownedIds.has(msg.id);
                        const isDragging = drag.draggingId === msg.id;

                        return (
                            <div
                                key={msg.id}
                                className={`absolute pointer-events-auto ${canDrag ? 'cursor-move' : 'cursor-default'} ${isDragging ? '' : 'transition-all duration-75 ease-out'}`}
                                style={{
                                    left,
                                    top,
                                    zIndex: msg.position.z,
                                }}
                                onMouseDown={(e) => drag.handleNoteMouseDown(e, msg)}
                            >
                                <Note
                                    message={msg}
                                    index={idx}
                                    owned={canDrag}
                                    onEdit={openEdit}
                                    onDelete={removeMessage}
                                />
                            </div>
                        );
                    })}
                    {step === 'positioning' && (
                        <div
                            className="absolute z-50 cursor-move pointer-events-auto"
                            style={{
                                left: `${drag.tempPosition.x}%`,
                                top: `${drag.tempPosition.y}%`,
                            }}
                            onMouseDown={drag.handleTempMouseDown}
                        >
                            <div className="relative">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                    Drag me!
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
                                />

                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="bg-white/90 hover:bg-white shadow-lg text-red-600"
                                        onClick={() => setStep('input')}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 shadow-lg text-white"
                                        onClick={handleFinalSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
                                        Confirm
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
                    title="Add Message"
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
        </div>
    );
}
