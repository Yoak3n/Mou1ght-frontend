export function getVisitorToken(): string {
    if (typeof window === 'undefined') return '';
    
    const key = 'mou1ght_visitor_token';
    let token = localStorage.getItem(key);
    
    if (!token) {
        token = crypto.randomUUID();
        localStorage.setItem(key, token);
    }
    
    return token;
}
