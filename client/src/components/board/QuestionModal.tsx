'use client';

import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

interface QuestionModalProps {
    question: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
}

// 留言板的验证问答弹窗（答案由后端校验，此处仅负责输入与引导）。
export default function QuestionModal({ question, value, onChange, onSubmit, onCancel }: QuestionModalProps) {
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card rounded-lg shadow-2xl w-full max-w-md p-6 relative">
                <button onClick={onCancel} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                    <XIcon className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold mb-4 text-card-foreground">Security Check</h2>
                <p className="mb-4 text-muted-foreground">{question}</p>
                <input
                    type="text"
                    className="w-full border-input p-2 rounded mb-4"
                    placeholder="Answer..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                    autoFocus
                />
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button onClick={onSubmit}>Submit</Button>
                </div>
            </div>
        </div>
    );
}
