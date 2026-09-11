'use client';

import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

interface MessageInputModalProps {
    title: string;
    value: string;
    placeholder?: string;
    submitLabel?: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    submitDisabled?: boolean;
    submitting?: boolean;
}

// 留言文本输入/编辑弹窗（新建留言与编辑自己的留言共用）。
export default function MessageInputModal({
    title,
    value,
    placeholder = 'Write your message here...',
    submitLabel = 'Next: Place Note',
    onChange,
    onSubmit,
    onCancel,
    submitDisabled = false,
    submitting = false,
}: MessageInputModalProps) {
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative">
                <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XIcon className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
                <div className="bg-yellow-100 p-4 rounded-sm shadow-md mb-6 rotate-1">
                    <textarea
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-40 bg-transparent border-none focus:ring-0 resize-none outline-none text-gray-800 text-lg leading-relaxed placeholder:text-gray-400/70"
                        style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}
                        autoFocus
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button onClick={onSubmit} disabled={submitDisabled || submitting} className="bg-amber-600 hover:bg-amber-700">
                        {submitLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
