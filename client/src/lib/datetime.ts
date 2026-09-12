/** 后端时间多为 "2006-01-02 15:04:05"（无时区），按本地展示并统一中文习惯 */

export function toDate(value: string | number | Date | undefined | null): Date | null {
  if (value === undefined || value === null || value === '') return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const raw = value.trim();
  // "YYYY-MM-DD HH:mm[:ss]" 按本地时间解析，避免被当成 UTC 导致日期偏移
  const localMatch = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(raw);
  if (localMatch) {
    const [, y, mo, d, h, mi, s] = localMatch;
    const date = new Date(
      Number(y),
      Number(mo) - 1,
      Number(d),
      Number(h),
      Number(mi),
      Number(s || '0')
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** 本地日历日，用于按天分组：YYYY-MM-DD */
export function toDateKey(value: string | number | Date | undefined | null): string {
  const raw = typeof value === 'string' ? value.trim() : '';
  const prefix = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (prefix) return prefix[0];
  const d = toDate(value);
  if (!d) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 中文习惯日期：2026年9月12日 */
export function formatDate(value: string | number | Date | undefined | null): string {
  const raw = typeof value === 'string' ? value.trim() : '';
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (ymd) {
    return `${ymd[1]}年${Number(ymd[2])}月${Number(ymd[3])}日`;
  }
  const d = toDate(value);
  if (!d) return '';
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 中文习惯日期时间：2026-09-12 12:14 */
export function formatDateTime(value: string | number | Date | undefined | null): string {
  const raw = typeof value === 'string' ? value.trim() : '';
  const ymdhm = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/.exec(raw);
  if (ymdhm) return `${ymdhm[1]} ${ymdhm[2]}`;
  const d = toDate(value);
  if (!d) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 仅时分：12:14（用于按天分组列表） */
export function formatTime(value: string | number | Date | undefined | null): string {
  const raw = typeof value === 'string' ? value.trim() : '';
  const hm = /[T ](\d{2}:\d{2})/.exec(raw);
  if (hm) return hm[1];
  const d = toDate(value);
  if (!d) return '';
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 头像地址规范化：空值返回空串；相对路径补 /；支持绝对 URL / data */
export function resolveAvatarUrl(value?: string | null): string {
  const v = (value || '').trim();
  if (!v) return '';
  if (/^(https?:)?\/\//.test(v) || v.startsWith('data:') || v.startsWith('blob:')) return v;
  if (v.startsWith('/')) return v;
  return `/${v}`;
}

/** 头像加载失败时的首字母 fallback */
export function avatarFallbackText(username?: string | null): string {
  const name = (username || '').trim();
  if (!name) return '?';
  return name[0].toUpperCase();
}
