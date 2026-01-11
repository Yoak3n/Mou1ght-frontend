'use client'
import { useState, type FC } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { Sign } from "@/types/post";
import Link from "next/link";


const TagsList: FC<{tags: Sign[]}> = ({tags}) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex flex-col gap-2"
        >
            <div className="flex items-center justify-between gap-4 px-4">
                <h4 className="text-sm font-semibold">
                    标签列表
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
                        tags.map(item=> {
                            return (
                                <Link key={item.id} href={`/tag/${item.label}`}>
                                    <Badge variant="outline" className="hover:bg-accent cursor-pointer">
                                        {item.label}
                                    </Badge>
                                </Link>
                            )
                        })
                    }
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}
export default TagsList