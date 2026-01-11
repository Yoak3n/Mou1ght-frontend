import type { FC } from 'react';
import type { Metadata } from 'next';
import { getSharingList } from '@/lib/api';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LikeButton from '@/components/interaction/like';
import ViewButton from '@/components/display/view';

export const metadata: Metadata = {
  title: '日常分享',
  description: 'Daily sharing',
};

const SharingPage: FC = async () => {
  const sharings = await getSharingList();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">日常分享</h1>
      {sharings && sharings.length > 0 ? (
          <div className="grid gap-6">
              {sharings.map(sharing => (
                  <Card key={sharing.id} className="w-full bg-white hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                          <Avatar>
                              <AvatarImage src={sharing.author.avatar} alt={sharing.author.username} />
                              <AvatarFallback>{sharing.author.username ? sharing.author.username[0].toUpperCase() : 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                              <span className="font-semibold">{sharing.author.username}</span>
                              <span className="text-xs text-gray-500">{new Date(sharing.time.created_at).toLocaleString()}</span>
                          </div>
                      </CardHeader>
                      <CardContent>
                          <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{sharing.content}</p>
                          {sharing.attachments && sharing.attachments.length > 0 && (
                              <div className="mt-4 grid grid-cols-2 gap-2">
                                  {sharing.attachments.map((att, idx) => (
                                      <img key={idx} src={att.file_path} alt={att.file_name} className="rounded-md max-h-60 object-cover w-full" />
                                  ))}
                              </div>
                          )}
                      </CardContent>
                      <CardFooter className="flex justify-between border-t border-gray-100 pt-4">
                           <div className="flex gap-4">
                               <LikeButton count={sharing.state.like} type="sharing" />
                               <ViewButton count={sharing.state.view} type="sharing" />
                           </div>
                      </CardFooter>
                  </Card>
              ))}
          </div>
      ) : (
          <p className="text-gray-500 text-center py-10">暂无分享内容</p>
      )}
    </div>
  );
};

export default SharingPage;