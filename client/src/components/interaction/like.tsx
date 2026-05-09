'use client'
import { useState, FC } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { likePost } from '@/lib/api/common';

interface LikeButtonProps {
  id: string;
  count: number;
  type: 'article' | 'sharing' | 'message';
}

const LikeButton: FC<LikeButtonProps> = ({ id, count, type }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentCount, setCurrentCount] = useState(count);

  const handleLike = async () => {
    const prevLiked = isLiked;
    const prevCount = currentCount;
    setIsLiked(!isLiked);
    setCurrentCount(isLiked ? currentCount - 1 : currentCount + 1);
    const ok = await likePost(id, type);
    if (!ok) {
      setIsLiked(prevLiked);
      setCurrentCount(prevCount);
    }
  };

  return (
    <Button onClick={handleLike} variant="ghost" className='cursor-pointer'> 
      <Heart color={isLiked ? 'red' : 'gray'}  fill={isLiked ? 'red' : 'gray'}/>
      <span className="ml-2">{currentCount}</span>
    </Button>
  );
};

export default LikeButton;