'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageInfo, MessagePosition } from '@/types/post';
import { Board as BoardConfig } from '@/types';
import { createMessage, updateMessage, updateMessagePosition } from '@/lib/api/message';
import { getVisitorToken } from '@/lib/visitor';
import Note from './Note';
import { Button } from '@/components/ui/button';
import { PlusIcon, XIcon, Loader2, CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BoardProps {
    initialMessages: MessageInfo[];
    boardSettings?: BoardConfig;
}

type Step = 'idle' | 'question' | 'input' | 'positioning';

export default function Board({ initialMessages, boardSettings }: BoardProps) {
    const router = useRouter();
    const boardRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<MessageInfo[]>(initialMessages);
    const [visitorToken, setVisitorToken] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Interaction States
    const [step, setStep] = useState<Step>('idle');
    const [questionAnswer, setQuestionAnswer] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Positioning State
    const [tempPosition, setTempPosition] = useState<MessagePosition>({ x: 50, y: 50, z: 0 });
    const [isDraggingTemp, setIsDraggingTemp] = useState(false);
    
    // Dragging Existing Note State
    const [draggingMessageId, setDraggingMessageId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Refs for global event listeners
    const messagesRef = useRef(messages);
    const draggingMessageIdRef = useRef(draggingMessageId);
    const isDraggingTempRef = useRef(isDraggingTemp);
    const visitorTokenRef = useRef(visitorToken);

    useEffect(() => { messagesRef.current = messages; }, [messages]);
    useEffect(() => { draggingMessageIdRef.current = draggingMessageId; }, [draggingMessageId]);
    useEffect(() => { isDraggingTempRef.current = isDraggingTemp; }, [isDraggingTemp]);
    useEffect(() => { visitorTokenRef.current = visitorToken; }, [visitorToken]);

    // Sync state with props
    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    // Initialize visitor token and admin status
    useEffect(() => {
        setVisitorToken(getVisitorToken());
        setIsAdmin(!!localStorage.getItem('token'));
    }, []);

    const handleStart = () => {
        if (boardSettings?.question) {
            setStep('question');
            setQuestionAnswer('');
        } else {
            setStep('input');
        }
    };

    const handleQuestionSubmit = () => {
        if (questionAnswer.trim() === boardSettings?.answer) {
            setStep('input');
        } else {
            alert('Incorrect answer. Please try again.');
        }
    };

    const handleInputSubmit = () => {
        if (!newMessage.trim()) return;
        setStep('positioning');
        
        const maxZ = messages.reduce((max, m) => Math.max(max, m.position.z), 0);
        setTempPosition(prev => ({ ...prev, z: maxZ + 1 }));
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        const token = localStorage.getItem('token') || undefined;
        
        const success = await createMessage({
            content: newMessage,
            position: tempPosition,
            author_ip: visitorToken 
        }, token);

        if (success) {
            setStep('idle');
            setNewMessage('');
            router.refresh(); 
            if (boardSettings?.need_reviewed) {
                alert('Message submitted successfully! It will appear after review.');
            }
        } else {
            alert('Failed to post message. Please try again.');
        }
        setIsSubmitting(false);
    };

    // Drag Logic
    const handleTempMouseDown = (e: React.MouseEvent) => {
        setIsDraggingTemp(true);
    };

    const handleExistingNoteMouseDown = (e: React.MouseEvent, msg: MessageInfo) => {
        e.stopPropagation();
        
        // Permission check
        const isOwner = msg.author_ip === visitorToken;
        if (!isOwner && !isAdmin) return;

        if (!boardRef.current) return;
        const rect = boardRef.current.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        
        setDragOffset({
            x: mouseX - msg.position.x,
            y: mouseY - msg.position.y
        });

        // Bring to front
        const maxZ = messages.reduce((max, m) => Math.max(max, m.position.z), 0);
        const newZ = maxZ + 1;
        
        setMessages(prev => prev.map(m => 
            m.id === msg.id ? { ...m, position: { ...m.position, z: newZ } } : m
        ));

        setDraggingMessageId(msg.id);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if ((!isDraggingTemp && !draggingMessageId) || !boardRef.current) return;
        
        const rect = boardRef.current.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        
        if (isDraggingTemp) {
            const clampedX = Math.max(0, Math.min(100, mouseX));
            const clampedY = Math.max(0, Math.min(100, mouseY));
            setTempPosition(prev => ({ ...prev, x: clampedX, y: clampedY }));
        } else if (draggingMessageId) {
            let newX = mouseX - dragOffset.x;
            let newY = mouseY - dragOffset.y;
            
            // Allow dragging slightly off-board? 
            // Let's clamp to keep it visible.
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));

            setMessages(prev => prev.map(msg => 
                msg.id === draggingMessageId 
                ? { ...msg, position: { ...msg.position, x: newX, y: newY } }
                : msg
            ));
        }
    };

    // Global mouse up handler
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDraggingTempRef.current) {
                setIsDraggingTemp(false);
            }
            
            if (draggingMessageIdRef.current) {
                const msg = messagesRef.current.find(m => m.id === draggingMessageIdRef.current);
                if (msg) {
                    const token = localStorage.getItem('token');
                    if (token) {
                        updateMessage({
                            id: msg.id,
                            content: msg.content,
                            position: msg.position,
                            author_ip: msg.author_ip
                        }, token);
                    } else {
                        updateMessagePosition({
                            id: msg.id,
                            position: msg.position,
                            author_ip: visitorTokenRef.current
                        });
                    }
                }
                setDraggingMessageId(null);
            }
        };
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div 
            ref={boardRef}
            className="relative min-h-[80vh] bg-[#fdf5e6] rounded-xl border-8 border-[#8B4513] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] overflow-hidden select-none"
            onMouseMove={handleMouseMove}
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
                <div className="absolute inset-0 top-20 pointer-events-none">
                     {messages.map((msg, idx) => {
                         const isLegacy = msg.position.x === 0 && msg.position.y === 0;
                         const left = isLegacy ? ((idx % 4) * 20 + 5) + '%' : msg.position.x + '%';
                         const top = isLegacy ? (Math.floor(idx / 4) * 25 + 5) + '%' : msg.position.y + '%';
                         
                         const isOwner = msg.author_ip === visitorToken;
                         const canDrag = isOwner || isAdmin;

                         return (
                            <div 
                                key={`${msg.id}-${idx}`}
                                className={`absolute transition-all duration-75 ease-out pointer-events-auto ${canDrag ? 'cursor-move' : 'cursor-default'}`}
                                style={{ 
                                    left, 
                                    top,
                                    zIndex: msg.position.z 
                                }}
                                onMouseDown={(e) => handleExistingNoteMouseDown(e, msg)}
                            >
                                <Note message={msg} index={idx} />
                            </div>
                         );
                     })}
                </div>

                {/* Positioning Layer (Ghost Note) */}
                {step === 'positioning' && (
                    <div 
                        className="absolute z-50 cursor-move"
                        style={{ 
                            left: `${tempPosition.x}%`, 
                            top: `${tempPosition.y}%`,
                        }}
                        onMouseDown={handleTempMouseDown}
                    >
                         <div className="relative">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                Drag me!
                            </div>
                            <Note 
                                message={{
                                    id: 'temp',
                                    content: newMessage,
                                    position: tempPosition,
                                    state: { view: 0, like: 0, length: 0, status: 'draft' },
                                    time: { created_at: new Date().toISOString(), updated_at: '' },
                                }} 
                                index={999} 
                            />
                            
                            {/* Confirmation Actions */}
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

             {/* Floating Action Button */}
             {step === 'idle' && (
                <Button 
                    onClick={handleStart}
                    className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl bg-amber-600 hover:bg-amber-700 text-white z-40 transition-all hover:scale-110"
                    size="icon"
                    title="Add Message"
                >
                    <PlusIcon className="w-8 h-8" />
                </Button>
             )}

            {/* Question Modal */}
            {step === 'question' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative">
                        <button 
                            onClick={() => setStep('idle')}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Security Check</h2>
                        <p className="mb-4 text-gray-600">{boardSettings?.question}</p>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded mb-4" 
                            placeholder="Answer..." 
                            value={questionAnswer}
                            onChange={e => setQuestionAnswer(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleQuestionSubmit()}
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setStep('idle')}>Cancel</Button>
                            <Button onClick={handleQuestionSubmit}>Submit</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Input Modal */}
            {step === 'input' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative">
                         <button 
                            onClick={() => setStep('idle')}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                        
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Write Message</h2>
                        <div className="bg-yellow-100 p-4 rounded-sm shadow-md mb-6 rotate-1">
                            <textarea 
                                placeholder="Write your message here..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="w-full h-40 bg-transparent border-none focus:ring-0 resize-none outline-none text-gray-800 text-lg leading-relaxed placeholder:text-gray-400/70"
                                style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setStep('idle')}>Cancel</Button>
                            <Button onClick={handleInputSubmit} disabled={!newMessage.trim()} className="bg-amber-600 hover:bg-amber-700">
                                Next: Place Note
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
