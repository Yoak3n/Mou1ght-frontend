'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
    id: number;
    kind: ToastKind;
    message: string;
}

const TOAST_EVENT = 'app-toast';

// 轻量 toast：window 事件驱动，无第三方依赖。
// 用法：toast('success', '留言发布成功！')；页面需挂载一次 <Toaster />。
export function toast(kind: ToastKind, message: string) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
        new CustomEvent<ToastItem>(TOAST_EVENT, {
            detail: { id: Date.now() + Math.random(), kind, message },
        })
    );
}

const KIND_STYLES: Record<ToastKind, { className: string; icon: typeof Info }> = {
    success: { className: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200', icon: CheckCircle2 },
    error: { className: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200', icon: AlertCircle },
    info: { className: 'border-border bg-card text-card-foreground', icon: Info },
};

export function Toaster() {
    const [items, setItems] = useState<ToastItem[]>([]);

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];
        const onToast = (e: Event) => {
            const item = (e as CustomEvent<ToastItem>).detail;
            setItems(prev => [...prev.slice(-3), item]);
            timers.push(setTimeout(() => {
                setItems(prev => prev.filter(t => t.id !== item.id));
            }, 3200));
        };
        window.addEventListener(TOAST_EVENT, onToast);
        return () => {
            window.removeEventListener(TOAST_EVENT, onToast);
            timers.forEach(clearTimeout);
        };
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10001] flex flex-col items-center gap-2 pointer-events-none">
            {items.map(item => {
                const style = KIND_STYLES[item.kind];
                const Icon = style.icon;
                return (
                    <div
                        key={item.id}
                        className={`pointer-events-auto flex items-center gap-2 rounded-lg border px-4 py-2.5 shadow-lg text-sm animate-in fade-in slide-in-from-top-2 duration-200 ${style.className}`}
                    >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.message}</span>
                        <button
                            onClick={() => setItems(prev => prev.filter(t => t.id !== item.id))}
                            className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                            aria-label="关闭提示"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
