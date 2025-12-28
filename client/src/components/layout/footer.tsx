import { cn } from "@/lib/utils";
import { BottomExtra } from "@/types";

interface FooterProps {
    extra?: BottomExtra;
}

export default function Footer({ extra }: FooterProps){

    return (
        <div className="w-full flex items-center justify-center px-6 py-3  h-16">
            {extra?.html || "&copy; 2025 Mou1ght. All rights reserved."}
        </div>
    )
}
