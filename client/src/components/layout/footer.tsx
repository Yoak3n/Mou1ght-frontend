import { BottomExtra } from "@/types";

interface FooterProps {
    extra?: BottomExtra;
}

export default function Footer({ extra }: FooterProps) {
    return (
        <div className="w-full flex items-center justify-center px-6 py-3 h-16 text-sm text-muted-foreground">
            {extra?.html ? (
                // 底部拓展 HTML 来自后台配置（可信内容），按原始 HTML 渲染
                <div dangerouslySetInnerHTML={{ __html: extra.html }} />
            ) : (
                <span>© 2025 Mou1ght. All rights reserved.</span>
            )}
        </div>
    )
}
