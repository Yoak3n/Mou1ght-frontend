'use client'
import { useState, type FC } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { Sign } from "@/types/post";
import Link from 'next/link';
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
            <CollapsibleContent className="flex flex-col gap-2">
                {
                    categories.map(item => {
                        return <Link key={item.id} href={`/category/${item.id}`}>{item.label}</Link>
                    })
                }
            </CollapsibleContent>
        </Collapsible>
    );
};

export default Categories;