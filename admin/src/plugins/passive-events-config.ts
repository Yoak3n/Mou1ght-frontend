// 必须在 default-passive-events 之前求值（单独模块，避免被 import 提升打乱）
// 默认列表包含 pointer*/mouse*，会让 n-tree 拖拽无法 preventDefault
export const PASSIVE_EVENTS = [
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel',
    'wheel',
    'scroll',
    'mousewheel',
] as const

declare global {
    interface Window {
        defaultPassiveEvents_supportedPassiveEvents?: readonly string[]
    }
}

if (typeof window !== 'undefined') {
    window.defaultPassiveEvents_supportedPassiveEvents = PASSIVE_EVENTS
}
