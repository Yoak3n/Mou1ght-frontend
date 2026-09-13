'use client';

import { memo } from 'react';
import type { CSSProperties, FC } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { MessageInfo } from '@/types/post';
import LikeButton from '@/components/interaction/like';
import ViewButton from '@/components/display/view';
import ViewTracker from '@/components/interaction/viewTracker';

interface NoteProps {
    message: MessageInfo;
    index: number;
    owned?: boolean;
    dragging?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const COLORS = [
    'bg-yellow-100',
    'bg-green-100',
    'bg-blue-100',
    'bg-pink-100',
    'bg-orange-100',
];

const Note: FC<NoteProps> = ({ message, index, owned = false, dragging = false, onEdit, onDelete }) => {
    // 是否临时笔记（发布定位预览），不参与浏览/点赞统计
    const isTemp = message.id === 'temp';
    const messageId = message.id || '';

    // 用 ID 哈希决定颜色与旋转角：不掺 index，ISR 刷新后颜色保持稳定
    const hash = messageId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % COLORS.length;
    const rotate = (hash % 10) - 5; // -5 to +4 degrees

    // 只取日期部分（后端格式 "2006-01-02 15:04:05"），避免 toLocaleDateString 的 SSR/客户端时区差异
    const dateText = (message.time?.created_at || '').slice(0, 10);

    return (
        <div
            className={`
                ${COLORS[colorIndex]}
                p-5 w-64 min-h-52 max-h-72 shadow-md
                flex flex-col relative
                group
                ${dragging
                    ? 'shadow-2xl [transform:rotate(var(--note-rotate))_scale(1.05)]'
                    : 'transition-[transform,box-shadow] duration-300 hover:shadow-xl hover:z-10 [transform:rotate(var(--note-rotate))] hover:[transform:rotate(0deg)_scale(1.03)]'}
            `}
            style={{
                '--note-rotate': `${rotate}deg`,
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            } as CSSProperties}
        >
            {/* Pin Graphic */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm border border-red-800 relative">
                     <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-50"></div>
                </div>
                <div className="w-0.5 h-2 bg-gray-400 mx-auto -mt-1"></div>
            </div>

            <div className="flex-1 overflow-y-auto mt-3 pr-1 text-gray-800 whitespace-pre-wrap break-words leading-relaxed text-[15px] custom-scrollbar">
                {message.content}
            </div>

            <div className="mt-4 pt-2 border-t border-black/5 text-xs text-gray-500 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <span className="opacity-50">#{index + 1}</span>
                    <span>{dateText}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    {!isTemp && (
                        <div className="flex items-center gap-1">
                            <ViewButton count={message.state?.view ?? 0} type="message" />
                            <LikeButton id={message.id} count={message.state?.like ?? 0} type="message" />
                        </div>
                    )}
                    {owned && !isTemp && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onEdit?.(message.id)}
                                title="编辑"
                                aria-label="编辑留言"
                                className="p-1 rounded text-blue-600 hover:bg-black/10 transition-colors"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => onDelete?.(message.id)}
                                title="删除"
                                aria-label="删除留言"
                                className="p-1 rounded text-red-600 hover:bg-black/10 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {!isTemp && <ViewTracker id={message.id} type="message" />}
        </div>
    );
};

export default memo(Note);
