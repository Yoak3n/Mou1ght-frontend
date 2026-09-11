'use client';

import { useEffect, useRef } from 'react';
import { viewPost } from '@/lib/api/common';
import { getVisitorToken } from '@/lib/visitor';

interface ViewTrackerProps {
    id: string;
    type: 'article' | 'sharing' | 'message';
}

// 浏览计数在浏览器端触发：SSR/ISR 缓存命中时不应重复计数，爬虫也不再计入。
// 携带游客 token 以便后端按访问者去重（防刷）。
export default function ViewTracker({ id, type }: ViewTrackerProps) {
    const fired = useRef(false);

    useEffect(() => {
        if (fired.current) return;
        fired.current = true;
        getVisitorToken().then((token) => {
            viewPost(id, type, token);
        });
    }, [id, type]);

    return null;
}
