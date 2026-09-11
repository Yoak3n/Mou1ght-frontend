import { fetchVisitorToken } from '@/lib/api/message';

function isLikelyJwt(token: string): boolean {
    return token.split('.').length === 3;
}

// 游客 token 的获取走 server action（由 Next 服务端转发到后端），
// 浏览器端只负责缓存与校验，避免直接暴露后端地址。
export async function getVisitorToken(): Promise<string> {
    if (typeof window === 'undefined') return '';

    const key = 'mou1ght_visitor_token';
    const cached = localStorage.getItem(key);
    if (cached) {
        if (isLikelyJwt(cached)) return cached;
        localStorage.removeItem(key);
    }

    const token = await fetchVisitorToken();
    if (!token) return '';
    localStorage.setItem(key, token);
    return token;
}
