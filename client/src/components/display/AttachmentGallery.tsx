'use client'

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Attachment } from '@/types/post';

function getAttachmentPath(att: Attachment): string {
    const anyAtt = att as unknown as { file_path?: string; url?: string };
    return (anyAtt.file_path || anyAtt.url || '').trim();
}

function getAttachmentName(att: Attachment): string {
    const anyAtt = att as unknown as { file_name?: string; original_name?: string };
    return (anyAtt.file_name || anyAtt.original_name || '').trim();
}

function getAttachmentKey(att: Attachment, index: number): string {
    const anyAtt = att as unknown as { id?: string };
    return anyAtt.id || getAttachmentPath(att) || String(index);
}

function resolveAttachmentUrl(path: string): string {
    const raw = (path || '').trim();
    if (!raw) return '';
    if (/^(https?:)?\/\//.test(raw) || raw.startsWith('data:') || raw.startsWith('blob:')) return raw;

    const rawBase = ((process.env.NEXT_PUBLIC_BASE_URL || '').trim() || 'http://localhost:10420');
    const base = rawBase.replace(/\/+$/, '').replace(/\/api\/v1$/, '');
    if (raw.startsWith('/')) return `${base}${raw}`;
    return `${base}/${raw}`;
}

function getGridColsClass(count: number): string {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-3';
    if (count === 4) return 'grid-cols-2';
    return 'grid-cols-3';
}

interface AttachmentGalleryProps {
    attachments?: Attachment[];
    max?: number;
    className?: string;
}

export default function AttachmentGallery({
    attachments,
    max = 9,
    className,
}: AttachmentGalleryProps) {
    const list = useMemo(() => (Array.isArray(attachments) ? attachments : []), [attachments]);
    const visible = useMemo(() => list.slice(0, Math.max(0, max)), [list, max]);
    const count = visible.length;

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [brokenImages, setBrokenImages] = useState<Record<string, true>>({});

    const current = visible[activeIndex];
    const currentPath = current ? getAttachmentPath(current) : '';
    const currentName = current ? getAttachmentName(current) : '';
    const currentUrl = current ? resolveAttachmentUrl(currentPath) : '';
    const currentIsImage = current ? !!currentUrl && !brokenImages[currentUrl] : false;
    const extraCount = Math.max(0, list.length - visible.length);

    const close = useCallback(() => setOpen(false), []);
    const openAt = useCallback((index: number) => {
        setActiveIndex(Math.min(Math.max(index, 0), Math.max(visible.length - 1, 0)));
        setOpen(true);
    }, [visible.length]);

    const go = useCallback((delta: number) => {
        if (visible.length <= 1) return;
        setActiveIndex((prev) => {
            const next = (prev + delta) % visible.length;
            return next < 0 ? next + visible.length : next;
        });
    }, [visible.length]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') go(-1);
            if (e.key === 'ArrowRight') go(1);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, close, go]);

    if (count === 0) return null;

    return (
        <>
            <div
                className={cn(
                    'mt-3 w-full',
                    count === 1 ? 'max-w-[180px]' : 'max-w-[240px]',
                    count === 1 ? '' : 'grid gap-1',
                    count === 1 ? '' : getGridColsClass(count),
                    className,
                )}
            >
                {visible.map((att, idx) => {
                    const url = resolveAttachmentUrl(getAttachmentPath(att));
                    const image = !!url && !brokenImages[url];
                    const alt = getAttachmentName(att) || '附件';
                    const isSingle = count === 1;
                    return (
                        <button
                            key={getAttachmentKey(att, idx)}
                            type="button"
                            onClick={() => openAt(idx)}
                            className={cn(
                                'relative overflow-hidden rounded-md border border-gray-100 bg-gray-50',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300',
                                isSingle ? 'w-full' : '',
                            )}
                        >
                            {image ? (
                                <img
                                    src={url}
                                    alt={alt}
                                    loading="lazy"
                                    className={cn(
                                        'w-full object-cover',
                                        isSingle ? 'h-auto max-h-[140px]' : 'h-full aspect-square',
                                    )}
                                    onError={() => {
                                        if (!url) return;
                                        setBrokenImages((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
                                    }}
                                />
                            ) : (
                                <div
                                    className={cn(
                                        'w-full p-2 flex flex-col justify-between text-left',
                                        isSingle ? 'h-16' : 'aspect-square',
                                    )}
                                >
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FileText className="size-4" />
                                        <span className="text-xs line-clamp-2">{alt}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">点击查看</span>
                                </div>
                            )}

                            {idx === visible.length - 1 && extraCount > 0 ? (
                                <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                                    <span className="text-white text-lg font-semibold">+{extraCount}</span>
                                </div>
                            ) : null}
                        </button>
                    );
                })}
            </div>

            {open && current ? (
                <div
                    className="fixed inset-0 z-50 bg-black/80 p-4 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) close();
                    }}
                >
                    <div className="relative w-full max-w-5xl">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={close}
                            className="absolute right-0 top-0 text-white hover:bg-white/10 hover:text-white"
                            aria-label="关闭"
                        >
                            <X />
                        </Button>

                        {visible.length > 1 ? (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => go(-1)}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
                                    aria-label="上一张"
                                >
                                    <ChevronLeft />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => go(1)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
                                    aria-label="下一张"
                                >
                                    <ChevronRight />
                                </Button>
                            </>
                        ) : null}

                        <div className="pt-10">
                            {currentIsImage ? (
                                <img
                                    src={currentUrl}
                                    alt={currentName || '附件'}
                                    className="mx-auto max-h-[80vh] w-auto max-w-full object-contain rounded-lg"
                                    onError={() => {
                                        if (!currentUrl) return;
                                        setBrokenImages((prev) => (prev[currentUrl] ? prev : { ...prev, [currentUrl]: true }));
                                    }}
                                />
                            ) : (
                                <div className="mx-auto max-w-xl rounded-lg bg-white p-5">
                                    <div className="flex items-center gap-3">
                                        <FileText className="size-5 text-gray-600" />
                                        <div className="min-w-0">
                                            <div className="font-medium text-gray-900 truncate">{currentName || '附件'}</div>
                                            <div className="text-xs text-gray-500 truncate">{currentUrl || currentPath}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        {currentUrl ? (
                                            <Button asChild>
                                                <a href={currentUrl} target="_blank" rel="noreferrer">
                                                    <Download />
                                                    下载/打开
                                                </a>
                                            </Button>
                                        ) : (
                                            <Button disabled>
                                                <Download />
                                                无法打开
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-3 flex items-center justify-center gap-2 text-white/80 text-sm">
                                <span>
                                    {activeIndex + 1}/{visible.length}
                                </span>
                                <span className="max-w-[60vw] truncate">{currentName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

