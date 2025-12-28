import Link from "next/link";
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import type { LinkSetting } from "@/types";
import { Search } from "lucide-react";

interface HeaderProps {
    links?: LinkSetting[];
}
const internalLinkNameMap: Record<string, string> = {
    home: 'Home',
    categories: 'Categories',
    tags: 'Tags',
    board: 'Board',
}
const internalLinkHrefMap: Record<string, string> = {
    home: '/',
    categories: '/categories',
    tags: '/tags',
    board: '/board',
}

export default function Header({ links = [] }: HeaderProps) {
    const defaultLinks = [
        { label: "Home", href: "/", type: 'internal' },
        { label: "Categories", href: "/categories", type: 'internal' },
        { label: "Tags", href: "/tags", type: 'internal' },
    ];

    const displayLinks = links.length > 0 ? links : defaultLinks;

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
                    <nav>
                        <ul className="flex items-center gap-6">
                            {displayLinks.map((link, index) => (
                                <li key={index}>
                                    {
                                        <Link
                                            href={link.type === 'internal' ? internalLinkHrefMap[link.label] || '#' : link.href || '#'}
                                            className="relative text-gray-700 hover:text-amber-600 font-medium transition-colors py-1 block group/link"
                                        >
                                            {link.type === 'internal' ? internalLinkNameMap[link.label] || link.label : link.label}
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