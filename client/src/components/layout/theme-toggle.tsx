'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'mou1ght-theme';

// 暗色/亮色切换：类名挂在 <html> 上，持久化到 localStorage（首帧防闪烁脚本会提前应用）。
export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        setDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        try {
            localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
        } catch {
            // 隐私模式等场景忽略
        }
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            aria-label={dark ? '切换到亮色模式' : '切换到暗色模式'}
            title={dark ? '切换到亮色模式' : '切换到暗色模式'}
            className="text-foreground/70 hover:text-amber-500"
        >
            {dark ? <Sun /> : <Moon />}
        </Button>
    );
}
