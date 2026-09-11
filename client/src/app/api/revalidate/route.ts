import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// 后端内容变更后调用的按需缓存失效 webhook。
// 密钥在后端 config.yaml 的 client.revalidate_secret 与此处的
// REVALIDATE_SECRET 环境变量之间保持一致。
export async function POST(request: NextRequest) {
    const secret = process.env.REVALIDATE_SECRET;
    const provided = request.headers.get('x-revalidate-secret');
    if (!secret || provided !== secret) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    let body: { type?: string; path?: string } = {};
    try {
        body = await request.json();
    } catch {
        body = {};
    }

    // 所有数据读接口共享 content tag（unstable_cache），
    // 失效 tag 即清掉数据缓存；再失效全站路由缓存（ISR 页面）。
    revalidateTag('content', 'max');
    if (body.type === 'path' && body.path) {
        revalidatePath(body.path);
    } else {
        revalidatePath('/', 'layout');
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
}
