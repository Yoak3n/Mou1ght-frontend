import type { FC } from 'react';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import { getSharingList } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LikeButton from '@/components/interaction/like';
import ViewButton from '@/components/display/view';
import AttachmentGallery from '@/components/display/AttachmentGallery';
import {
  avatarFallbackText,
  formatDateTime,
  resolveAvatarUrl,
  toDateKey,
} from '@/lib/datetime';
import type { SharingInfo } from '@/types/post';

// ISR：列表页缓存 5 分钟，后端发布/删除说说时按需失效。
export const revalidate = 300;

export const metadata: Metadata = {
  title: '日常分享',
  description: 'Daily sharing',
};

const SharingCard: FC<{ sharing: SharingInfo }> = ({ sharing }) => {
  const dayKey = toDateKey(sharing.time.created_at);

  return (
    <article
      id={`sharing-${sharing.id}`}
      data-day={dayKey}
      className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow scroll-mt-24"
    >
      <div className="flex items-start gap-3 px-5 pt-5">
        <Avatar className="size-10 shrink-0">
          <AvatarImage
            src={resolveAvatarUrl(sharing.author.avatar)}
            alt={sharing.author.username || 'author'}
          />
          <AvatarFallback className="text-sm">
            {avatarFallbackText(sharing.author.username)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-semibold text-foreground truncate">
              {sharing.author.username || '匿名'}
            </span>
            <time className="text-xs text-muted-foreground" dateTime={sharing.time.created_at}>
              {formatDateTime(sharing.time.created_at)}
            </time>
          </div>

          <p className="mt-2.5 whitespace-pre-wrap text-[15px] leading-7 text-foreground">
            {sharing.content}
          </p>

          {sharing.attachments && sharing.attachments.length > 0 ? (
            <div className="mt-3">
              <AttachmentGallery attachments={sharing.attachments} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-5 border-t border-border/70 px-5 py-3">
        <ViewButton count={sharing.state.view} type="sharing" />
        <LikeButton id={sharing.id} count={sharing.state.like} type="sharing" />
      </div>
    </article>
  );
};

const SharingPage: FC = async () => {
  const sharings = await getSharingList();

  const dayKeys = Array.from(
    new Set((sharings ?? []).map((s) => toDateKey(s.time.created_at)).filter(Boolean))
  ).sort((a, b) => (a < b ? 1 : -1));

  const formatDayLabel = (dayKey: string) => dayKey.replace(/-/g, '.');
  const dayAnchorId = (dayKey: string) => `day-${dayKey}`;

  const groups = dayKeys.map((dayKey) => ({
    dayKey,
    items: (sharings ?? []).filter((s) => toDateKey(s.time.created_at) === dayKey),
  }));

  return (
    <div className="min-h-screen bg-muted/40">
      {/* 主栏 + 时间轴整体居中，避免右侧大片空白 */}
      <div className="mx-auto flex w-full max-w-[880px] gap-8 px-4 sm:px-6 py-8">
        <main className="min-w-0 flex-1 max-w-[640px]">
          <div className="mb-6 flex items-end justify-between">
            <h1 className="text-2xl font-bold tracking-tight">日常分享</h1>
            <span className="text-sm text-muted-foreground">
              {sharings?.length ? `${sharings.length} 条` : ''}
            </span>
          </div>

          {groups.length > 0 ? (
            <div className="space-y-8">
              {groups.map((group) => (
                <section key={group.dayKey} id={dayAnchorId(group.dayKey)} className="scroll-mt-24">
                  <div className="mb-3 flex items-center gap-3">
                    <h2 className="text-sm font-semibold text-foreground tabular-nums">
                      {formatDayLabel(group.dayKey)}
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-4">
                    {group.items.map((sharing) => (
                      <SharingCard key={sharing.id} sharing={sharing} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">暂无分享内容</p>
          )}
        </main>

        {/* 恢复原时间轴样式：年/月分隔 + 横线 + hover 展开日期 */}
        {dayKeys.length > 0 ? (
          <aside className="hidden lg:block w-48 shrink-0">
            <div className="sticky top-24">
              <div className="text-sm font-semibold text-foreground mb-3">时间轴</div>
              <div className="relative pl-4">
                <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                <ul className="space-y-2">
                  {dayKeys.map((dayKey, index) => {
                    const prevDayKey = dayKeys[index - 1];
                    const year = dayKey.slice(0, 4);
                    const month = dayKey.slice(5, 7);
                    const prevYear = prevDayKey?.slice(0, 4);
                    const prevMonth = prevDayKey?.slice(5, 7);
                    const yearChanged = Boolean(prevDayKey && prevYear !== year);
                    const monthChanged = Boolean(prevDayKey && !yearChanged && prevMonth !== month);

                    return (
                      <Fragment key={dayKey}>
                        {yearChanged ? (
                          <li aria-hidden className="py-1">
                            <div className="flex items-center h-8 pl-16">
                              <div className="h-[2px] w-14 bg-border" />
                              <div className="ml-2 text-[11px] text-muted-foreground/70">{year}</div>
                            </div>
                          </li>
                        ) : null}

                        {monthChanged ? (
                          <li aria-hidden className="py-1">
                            <div className="flex items-center h-8 pl-16">
                              <div className="w-14 border-t border-dashed border-border" />
                              <div className="ml-2 text-[11px] text-muted-foreground/70">{Number(month)}月</div>
                            </div>
                          </li>
                        ) : null}

                        <li className="relative">
                          <a
                            href={`#${dayAnchorId(dayKey)}`}
                            className="group relative flex items-center h-8 pl-16 outline-none"
                          >
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-14 bg-border group-hover:bg-foreground/60 transition-colors" />
                            <span className="sr-only">{formatDayLabel(dayKey)}</span>
                            <span className="text-xs text-muted-foreground opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition whitespace-nowrap">
                              {formatDayLabel(dayKey)}
                            </span>
                          </a>
                        </li>
                      </Fragment>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
};

export default SharingPage;
