// 附件 URL 解析：被客户端组件与服务端组件共用，必须放在无 'use client' 的公共模块，
// 否则服务端组件调用 client 模块导出的函数会在生产环境抛 RSC 边界错误。
export function resolveAttachmentUrl(path: string): string {
    const raw = (path || '').trim();
    if (!raw) return '';
    // 绝对 URL / data / blob 原样返回
    if (/^(https?:)?\/\//.test(raw) || raw.startsWith('data:') || raw.startsWith('blob:')) return raw;

    // 其余一律按同源相对路径处理：生产环境 nginx 已将 /upload/ 转发到后端；
    // 本地开发需要预览附件时，可在构建时设置 NEXT_PUBLIC_BASE_URL=http://localhost:10420
    const rawBase = (process.env.NEXT_PUBLIC_BASE_URL || '').trim();
    if (rawBase) {
        const base = rawBase.replace(/\/+$/, '').replace(/\/api\/v1$/, '');
        return raw.startsWith('/') ? `${base}${raw}` : `${base}/${raw}`;
    }
    return raw.startsWith('/') ? raw : `/${raw}`;
}
