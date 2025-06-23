'use client';
import { RefObject } from 'react';
import useEventListener from './useEventListener';

type Handler = (event: MouseEvent | TouchEvent) => void;

const useClickOutside = <T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T | null>,
  handler: Handler,
  mouseEvent: ['mousedown', 'touchstart'] | ['mouseup', 'touchend'] = [
    'mousedown',
    'touchstart',
  ],
): void => {
  const [mouse, touch] = mouseEvent;
  useEventListener(mouse, (event) => {
    const el = ref?.current;

    // Do nothing if clicking ref's element or descendent elements
    if (!el || el.contains(event.target as Node)) {
      return;
    }

    handler(event);
  });

  useEventListener(touch, (event) => {
    const el = ref?.current;

    // Do nothing if clicking ref's element or descendent elements
    if (!el || el.contains(event.target as Node)) {
      return;
    }

    handler(event);
  });
};

export default useClickOutside;
