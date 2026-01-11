'use client'
import { useState, type FC } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Sign } from "@/types/post";
const Categories: FC<{ categories: Sign[] }> = ({ categories }) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex flex-col gap-2"
        >
            <div className="flex items-center justify-between gap-4 px-4">
                <h4 className="text-sm font-semibold">
                    分类列表
                </h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                        <ChevronsUpDown />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="px-2">
                <div className="flex flex-wrap gap-2">
                    {
                        categories.map(item => {
                            return (
                                <Link key={item.id} href={`/category/${item.label}`}>
                                    <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                                        {item.label}
                                    </Badge>
                                </Link>
                            )
                        })
                    }
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

export default Categories;