import { Music } from 'lucide-react';
import type { Attachment } from '@/types/post';
import AttachmentGallery from './AttachmentGallery';
import { resolveAttachmentUrl } from '@/lib/attachment';

function attachmentName(att: Attachment): string {
    const anyAtt = att as unknown as { file_name?: string; original_name?: string };
    return (anyAtt.file_name || anyAtt.original_name || '').trim() || '附件';
}

function isAudio(att: Attachment): boolean {
    const mime = (att.mime || '').toLowerCase();
    if (mime.startsWith('audio/')) return true;
    return /\.(mp3|flac|wav|ogg|oga|m4a|aac)$/i.test((att.file_path || '').trim());
}

/**
 * 文章附件展示：音频渲染为可播放的播放器卡片，其余（图片等）交给 AttachmentGallery。
 * 纯服务端组件：audio 使用原生控件，无需客户端 JS。
 */
export default function ArticleAttachments({ attachments }: { attachments?: Attachment[] }) {
    const list = Array.isArray(attachments) ? attachments : [];
    if (list.length === 0) return null;

    const audios = list.filter(isAudio);
    const others = list.filter((att) => !audios.includes(att));

    return (
        <div className="mt-8 space-y-3">
            {audios.length > 0 && (
                <div className="text-sm font-semibold text-muted-foreground">音频</div>
            )}
            {audios.map((att, idx) => {
                const url = resolveAttachmentUrl(att.file_path || '');
                return (
                    <div
                        key={att.file_path || `audio-${idx}`}
                        className="rounded-lg border border-border bg-muted/40 p-3"
                    >
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                            <Music className="size-4 shrink-0 text-amber-600" />
                            <span className="truncate">{attachmentName(att)}</span>
                        </div>
                        {url ? (
                            <audio controls preload="none" src={url} className="h-10 w-full">
                                您的浏览器不支持音频播放。
                            </audio>
                        ) : (
                            <div className="text-xs text-muted-foreground">附件地址缺失，无法播放</div>
                        )}
                    </div>
                );
            })}

            {others.length > 0 && <AttachmentGallery attachments={others} />}
        </div>
    );
}
