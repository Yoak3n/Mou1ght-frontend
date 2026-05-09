function getApiBaseUrl(): string {
    const raw = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:10420";
    const trimmed = raw.replace(/\/+$/, "");
    return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
}

function isLikelyJwt(token: string): boolean {
    return token.split('.').length === 3;
}

export async function getVisitorToken(): Promise<string> {
    if (typeof window === 'undefined') return '';

    const key = 'mou1ght_visitor_token';
    const cached = localStorage.getItem(key);
    if (cached) {
        if (isLikelyJwt(cached)) return cached;
        localStorage.removeItem(key);
    }

    const res = await fetch(`${getApiBaseUrl()}/message/visitor`, {
        method: 'GET',
    });
    if (!res.ok) return '';
    const json = await res.json();
    const token = json?.data?.id;
    if (typeof token !== 'string' || token.length === 0) return '';
    localStorage.setItem(key, token);
    return token;
}
