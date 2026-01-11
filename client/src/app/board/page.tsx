import type { FC } from 'react';
import type { Metadata } from 'next';
import { getMessageList, getBlogSetting } from '@/lib/api';
import Board from '@/components/board/Board';

export const metadata: Metadata = {
  title: '留言板',
  description: 'Leave a message on the board',
};

const BoardPage: FC = async () => {
  const messages = await getMessageList();
  const settings = await getBlogSetting();

  return (
    <div className="container mx-auto px-4 py-8">
      <Board initialMessages={messages || []} boardSettings={settings?.board} />
    </div>
  );
};

export default BoardPage;