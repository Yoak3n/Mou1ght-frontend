 'use client';

import Link from "next/link";
import { cn } from "@/lib/utils"
import type { LinkSetting } from "@/types";
import { Check, Rss, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
    links?: LinkSetting[];
}
const internalLinkNameMap: Record<string, string> = {
    home: 'Home',
    board: 'Board',
    sharings: 'Sharings',
}
const internalLinkHrefMap: Record<string, string> = {
    home: '/',
    board: '/board',
    sharings: '/sharings',
}

export default function Header({ links = [] }: HeaderProps) {
    const defaultLinks = [
        { label: "Home", href: "/", type: 'internal' },
        { label: "Board", href: "/board", type: 'internal' },
        { label: "Sharings", href: "/sharings", type: 'internal' },
    ];

    const displayLinks = links.length > 0 ? links : defaultLinks;
    const [copied, setCopied] = useState(false);
    const resetTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
        };
    }, []);

    const copyRssUrl = async () => {
        if (typeof window === 'undefined') return;
        const rssUrl = `${window.location.origin}/rss.xml`;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(rssUrl);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = rssUrl;
                textarea.setAttribute("readonly", "");
                textarea.style.position = "fixed";
                textarea.style.top = "0";
                textarea.style.left = "0";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }

            setCopied(true);
            if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
            resetTimerRef.current = window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="group fixed top-0 left-0 w-full z-50 hover:translate-y-0 -translate-y-[calc(100%-10px)] transition-transform duration-300">
            <div className={cn(
                "w-full flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm h-16",
            )} >
                <div className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors cursor-pointer">
                    <Link href="/">Mou1ght</Link>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all text-gray-700 placeholder:text-gray-400"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={copyRssUrl}
                        aria-label={copied ? "RSS 地址已复制" : "复制 RSS 订阅地址"}
                        title={copied ? "已复制" : "复制 RSS 订阅地址"}
                        className="text-gray-700 hover:text-amber-600"
                    >
                        {copied ? <Check /> : <Rss />}
                        <span className="sr-only">{copied ? "已复制" : "复制 RSS 订阅地址"}</span>
                    </Button>
                    <nav>
                        <ul className="flex items-center gap-6">
                            {displayLinks.map((link, index) => (
                                <li key={index}>
                                    {
                                        <Link
                                            href={
                                                link.type === 'internal'
                                                    ? (link.href || internalLinkHrefMap[link.label] || '#')
                                                    : link.type === 'category'
                                                        ? (link.href || `/category/${encodeURIComponent(link.label || '')}`)
                                                        : link.type === 'tag'
                                                            ? (link.href || `/tag/${encodeURIComponent(link.label || '')}`)
                                                            : (link.href || '#')
                                            }
                                            className="relative text-gray-700 hover:text-amber-600 font-medium transition-colors py-1 block group/link"
                                        >
                                            {
                                                link.type === 'internal'
                                                    ? (internalLinkNameMap[link.label] && !link.href ? internalLinkNameMap[link.label] : link.label)
                                                    : link.label
                                            }
                                            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-amber-500 scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                                        </Link>
                                    }

                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            {/* Invisible trigger area */}
            <div className="h-6 w-full absolute bottom-0 translate-y-full bg-transparent"></div>
        </div>
    )
}
