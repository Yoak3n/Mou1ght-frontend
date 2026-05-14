import { Fragment, type FC } from 'react';
import type { Metadata } from 'next';
import { getSharingList } from '@/lib/api';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LikeButton from '@/components/interaction/like';
import ViewButton from '@/components/display/view';
import AttachmentGallery from '@/components/display/AttachmentGallery';

export const metadata: Metadata = {
  title: '日常分享',
  description: 'Daily sharing',
};

const SharingPage: FC = async () => {
  const sharings = await getSharingList();

  const sharingsByDay = (sharings ?? []).reduce<Record<string, typeof sharings>>((acc, sharing) => {
    const dayKey = new Date(sharing.time.created_at).toISOString().slice(0, 10);
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(sharing);
    return acc;
  }, {});

  const dayKeys = Object.keys(sharingsByDay).sort((a, b) => (a < b ? 1 : -1));

  const formatDayLabel = (dayKey: string) => {
    const [y, m, d] = dayKey.split('-');
    return `${y}.${m}.${d}`;
  };

  const dayAnchorId = (dayKey: string) => `day-${dayKey}`;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-end justify-between mb-8">
          <h1 className="text-2xl font-bold">日常分享</h1>
          <span className="text-sm text-gray-500">
            {sharings?.length ? `${sharings.length} 条` : ''}
          </span>
        </div>

        {sharings && sharings.length > 0 ? (
          <div className="relative lg:pr-72">
            <main className="min-w-0">
              {dayKeys.map((dayKey) => (
                <section key={dayKey} id={dayAnchorId(dayKey)} className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-800">{formatDayLabel(dayKey)}</h2>
                  </div>

                  <div className="columns-1 sm:columns-2 gap-6 [column-fill:balance]">
                    {sharingsByDay[dayKey]?.map((sharing) => (
                      <div key={sharing.id} id={`sharing-${sharing.id}`} className="mb-6 break-inside-avoid scroll-mt-24">
                        <Card className="w-full bg-white hover:shadow-md transition-shadow">
                          <CardHeader className="flex flex-row items-center gap-4 pb-3">
                            <Avatar>
                              <AvatarImage src={sharing.author.avatar} alt={sharing.author.username} />
                              <AvatarFallback>
                                {sharing.author.username ? sharing.author.username[0].toUpperCase() : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold truncate">{sharing.author.username}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(sharing.time.created_at).toLocaleString()}
                              </span>
                            </div>
                          </CardHeader>

                          <CardContent>
                            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{sharing.content}</p>
                            <AttachmentGallery attachments={sharing.attachments} />
                          </CardContent>

                          <CardFooter className="flex justify-between border-t border-gray-100 pt-3">
                            <div className="flex gap-4">
                              <LikeButton id={sharing.id} count={sharing.state.like} type="sharing" />
                              <ViewButton count={sharing.state.view} type="sharing" />
                            </div>
                          </CardFooter>
                        </Card>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </main>

            <aside className="hidden lg:block fixed right-0 top-0 bottom-0 z-10 w-72">
              <div className="relative h-full pt-24 pb-8 pl-6 pr-4">
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                <div className="absolute right-2 top-0 bottom-0 w-px bg-gray-100" />

                <div className="text-sm font-semibold text-gray-800 mb-3">时间轴</div>
                <div className="relative pl-4">
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gray-200" />
                  <div className="max-h-[calc(100vh-9rem)] overflow-auto pr-2">
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
                                  <div className="h-[2px] w-14 bg-gray-400" />
                                  <div className="ml-2 text-[11px] text-gray-400">{year}</div>
                                </div>
                              </li>
                            ) : null}

                            {monthChanged ? (
                              <li aria-hidden className="py-1">
                                <div className="flex items-center h-8 pl-16">
                                  <div className="w-14 border-t border-dashed border-gray-300" />
                                  <div className="ml-2 text-[11px] text-gray-400">{Number(month)}月</div>
                                </div>
                              </li>
                            ) : null}

                            <li className="relative">
                              <a
                                href={`#${dayAnchorId(dayKey)}`}
                                className="group relative flex items-center h-8 pl-16 outline-none"
                              >
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-14 bg-gray-300 group-hover:bg-gray-600 transition-colors" />
                                <span className="sr-only">{formatDayLabel(dayKey)}</span>
                                <span className="text-xs text-gray-500 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition whitespace-nowrap">
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
              </div>
            </aside>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">暂无分享内容</p>
        )}
      </div>
    </div>
  );
};

export default SharingPage;
