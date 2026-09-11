'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent, MutableRefObject } from 'react';
import type { MessageInfo, MessagePosition } from '@/types/post';

interface UseMessageDragOptions {
    layerRef: MutableRefObject<HTMLDivElement | null>;
    messagesRef: MutableRefObject<MessageInfo[]>;
    setMessages: (updater: (prev: MessageInfo[]) => MessageInfo[]) => void;
    canDrag: (id: string) => boolean;
    onCommit: (msg: MessageInfo) => void;
}

// 留言板拖拽引擎：负责已有笔记与临时笔记的拖拽、层级置顶、全局 mouseup 提交。
// 位置持久化（onCommit）由调用方负责，这里只处理交互状态。
export function useMessageDrag({ layerRef, messagesRef, setMessages, canDrag, onCommit }: UseMessageDragOptions) {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [isDraggingTemp, setIsDraggingTemp] = useState(false);
    const [tempPosition, setTempPosition] = useState<MessagePosition>({ x: 50, y: 50, z: 0 });

    const draggingIdRef = useRef<string | null>(null);
    const isDraggingTempRef = useRef(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const onCommitRef = useRef(onCommit);

    useEffect(() => { onCommitRef.current = onCommit; });
    useEffect(() => { draggingIdRef.current = draggingId; }, [draggingId]);
    useEffect(() => { isDraggingTempRef.current = isDraggingTemp; }, [isDraggingTemp]);

    // 拖拽开始前把笔记置顶（z 取当前最大 +1）
    const bringToFront = useCallback((id: string) => {
        const maxZ = messagesRef.current.reduce((max, m) => Math.max(max, m.position.z), 0);
        setMessages(prev => prev.map(m =>
            m.id === id ? { ...m, position: { ...m.position, z: maxZ + 1 } } : m
        ));
    }, [messagesRef, setMessages]);

    const handleNoteMouseDown = useCallback((e: MouseEvent, msg: MessageInfo) => {
        e.stopPropagation();
        if (!canDrag(msg.id)) return;
        if (!layerRef.current) return;
        const rect = layerRef.current.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        dragOffsetRef.current = { x: mouseX - msg.position.x, y: mouseY - msg.position.y };
        bringToFront(msg.id);
        setDraggingId(msg.id);
    }, [canDrag, layerRef, bringToFront]);

    const handleTempMouseDown = useCallback(() => setIsDraggingTemp(true), []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDraggingTempRef.current && !draggingIdRef.current) return;
        if (!layerRef.current) return;
        const rect = layerRef.current.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        const clamp = (v: number) => Math.max(0, Math.min(100, v));

        if (isDraggingTempRef.current) {
            setTempPosition(prev => ({ ...prev, x: clamp(mouseX), y: clamp(mouseY) }));
        } else if (draggingIdRef.current) {
            const { x: offX, y: offY } = dragOffsetRef.current;
            setMessages(prev => prev.map(m =>
                m.id === draggingIdRef.current
                    ? { ...m, position: { ...m.position, x: clamp(mouseX - offX), y: clamp(mouseY - offY) } }
                    : m
            ));
        }
    }, [layerRef, setMessages]);

    // 全局 mouseup：结束拖拽并提交位置
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDraggingTemp(false);
            const draggingId = draggingIdRef.current;
            if (!draggingId) return;
            const msg = messagesRef.current.find(m => m.id === draggingId);
            setDraggingId(null);
            if (!msg) return;
            onCommitRef.current(msg);
        };
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [messagesRef]);

    return {
        draggingId,
        isDraggingTemp,
        tempPosition,
        setTempPosition,
        handleNoteMouseDown,
        handleTempMouseDown,
        handleMouseMove,
        bringToFront,
    };
}
