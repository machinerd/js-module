'use client';

import { useEffect, useId, useRef } from 'react';

interface StackEntry {
  id: string;
  onClose: () => void;
  lockScroll: boolean;
}

const stack: StackEntry[] = [];

const syncBodyScroll = () => {
  document.body.style.overflow = stack.some((entry) => entry.lockScroll)
    ? 'hidden'
    : 'unset';
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || stack.length === 0) {
    return;
  }

  const top = stack[stack.length - 1];
  event.preventDefault();
  event.stopImmediatePropagation();
  top.onClose();
};

let escapeListenerAttached = false;

const attachEscapeListener = () => {
  if (escapeListenerAttached) {
    return;
  }
  document.addEventListener('keydown', handleEscape, true);
  escapeListenerAttached = true;
};

const detachEscapeListener = () => {
  if (!escapeListenerAttached) {
    return;
  }
  document.removeEventListener('keydown', handleEscape, true);
  escapeListenerAttached = false;
};

const pushDialog = (id: string, onClose: () => void, lockScroll: boolean) => {
  stack.push({ id, onClose, lockScroll });
  syncBodyScroll();
  attachEscapeListener();
};

const popDialog = (id: string) => {
  const index = stack.findLastIndex((entry) => entry.id === id);
  if (index !== -1) {
    stack.splice(index, 1);
  }
  syncBodyScroll();
  if (stack.length === 0) {
    detachEscapeListener();
  }
};

export function useDialogStack(
  isOpen: boolean,
  onClose: () => void,
  lockScroll = true,
) {
  const dialogId = useId();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    pushDialog(dialogId, () => onCloseRef.current(), lockScroll);

    return () => {
      popDialog(dialogId);
    };
  }, [isOpen, dialogId, lockScroll]);
}
