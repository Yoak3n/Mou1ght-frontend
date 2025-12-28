'use client'
import { useState, FC } from 'react';

import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

interface LikeButtonProps {
  count: number;
  type: 'article' | 'sharing' | 'message';
}

const LikeButton: FC<LikeButtonProps> = ({ count, type }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Button onClick={() => setIsLiked(!isLiked)} variant="ghost" className='cursor-pointer'> 
      <Heart color={isLiked ? 'red' : 'gray'}  fill={isLiked ? 'red' : 'gray'}/>
      <span className="ml-2">{count}</span>
    </Button>
  );
};

export default LikeButton;