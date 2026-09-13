'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, MutableRefObject } from 'react';
import type { MessageInfo, MessagePosition } from '@/types/post';

interface UseMessageDragOptions {
    layerRef: MutableRefObject<HTMLDivElement | null>;
    messagesRef: MutableRefObject<MessageInfo[]>;
    setMessages: (updater: (prev: MessageInfo[]) => MessageInfo[]) => void;
    canDrag: (id: string) => boolean;
    onCommit: (msg: MessageInfo) => void;
}

// 留言板拖拽引擎：负责已有笔记与临时笔记的拖拽、层级置顶、全局 pointerup 提交。
// 位置持久化（onCommit）由调用方负责，这里只处理交互状态。
//
// 跟手性要点：
// - pointermove/pointerup 挂在 window 上，鼠标快速甩出板外也不会丢失跟踪；
// - ref 与 state 在 pointerdown 时同步赋值，避免首帧移动被丢弃；
// - move 事件经 requestAnimationFrame 合帧后再 setState，高频移动不塞爆渲染；
// - 使用 pointer 事件顺带获得触屏拖动能力（配合 touch-action: none）。
export function useMessageDrag({ layerRef, messagesRef, setMessages, canDrag, onCommit }: UseMessageDragOptions) {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [isDraggingTemp, setIsDraggingTemp] = useState(false);
    const [tempPosition, setTempPosition] = useState<MessagePosition>({ x: 50, y: 50, z: 0 });

    const draggingIdRef = useRef<string | null>(null);
    const isDraggingTempRef = useRef(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const onCommitRef = useRef(onCommit);
    const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => { onCommitRef.current = onCommit; });

    // 拖拽开始前把笔记置顶（z 取当前最大 +1）
    const bringToFront = useCallback((id: string) => {
        const maxZ = messagesRef.current.reduce((max, m) => Math.max(max, m.position.z), 0);
        setMessages(prev => prev.map(m =>
            m.id === id ? { ...m, position: { ...m.position, z: maxZ + 1 } } : m
        ));
    }, [messagesRef, setMessages]);

    const handleNoteMouseDown = useCallback((e: ReactPointerEvent, msg: MessageInfo) => {
        if (!canDrag(msg.id)) return;
        if (!layerRef.current) return;
        e.stopPropagation();
        const rect = layerRef.current.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        dragOffsetRef.current = { x: mouseX - msg.position.x, y: mouseY - msg.position.y };
        bringToFront(msg.id);
        // ref 与 state 同步赋值：若只走 state，拖拽头几帧 move 会被 ref 的旧值挡掉
        draggingIdRef.current = msg.id;
        setDraggingId(msg.id);
    }, [canDrag, layerRef, bringToFront]);

    const handleTempMouseDown = useCallback((e: ReactPointerEvent) => {
        e.stopPropagation();
        isDraggingTempRef.current = true;
        setIsDraggingTemp(true);
    }, []);

    const applyPointer = useCallback(() => {
        rafRef.current = null;
        const pointer = lastPointerRef.current;
        if (!pointer || !layerRef.current) return;
        const rect = layerRef.current.getBoundingClientRect();
        const mouseX = ((pointer.x - rect.left) / rect.width) * 100;
        const mouseY = ((pointer.y - rect.top) / rect.height) * 100;
        const clamp = (v: number) => Math.max(0, Math.min(100, v));

        if (isDraggingTempRef.current) {
            setTempPosition(prev => ({ ...prev, x: clamp(mouseX), y: clamp(mouseY) }));
        } else if (draggingIdRef.current) {
            const { x: offX, y: offY } = dragOffsetRef.current;
            const id = draggingIdRef.current;
            setMessages(prev => prev.map(m =>
                m.id === id
                    ? { ...m, position: { ...m.position, x: clamp(mouseX - offX), y: clamp(mouseY - offY) } }
                    : m
            ));
        }
    }, [layerRef, setMessages]);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!isDraggingTempRef.current && !draggingIdRef.current) return;
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
        if (rafRef.current == null) {
            rafRef.current = requestAnimationFrame(applyPointer);
        }
    }, [applyPointer]);

    // 拖拽期间在 window 上挂 move/up/cancel：结束拖拽并提交位置
    useEffect(() => {
        if (!draggingId && !isDraggingTemp) return;

        const handlePointerUp = () => {
            isDraggingTempRef.current = false;
            setIsDraggingTemp(false);
            const id = draggingIdRef.current;
            if (id) {
                draggingIdRef.current = null;
                setDraggingId(null);
                const msg = messagesRef.current.find(m => m.id === id);
                if (msg) onCommitRef.current(msg);
            }
            if (rafRef.current != null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            lastPointerRef.current = null;
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };
    }, [draggingId, isDraggingTemp, handlePointerMove, messagesRef]);

    return {
        draggingId,
        isDraggingTemp,
        tempPosition,
        setTempPosition,
        handleNoteMouseDown,
        handleTempMouseDown,
        bringToFront,
    };
}
