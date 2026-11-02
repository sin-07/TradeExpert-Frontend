'use client';

import { useEffect } from 'react';

/**
 * Custom hook to freeze/lock background scrolling when a modal or sidebar popup is active.
 * Handles touch gestures, desktop scrollbars, and prevents layout shift.
 */
export default function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isLocked) {
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const originalTouchAction = document.body.style.touchAction;
      const originalOverscroll = document.body.style.overscrollBehavior;

      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.overscrollBehavior = 'contain';

      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        document.body.style.touchAction = originalTouchAction;
        document.body.style.overscrollBehavior = originalOverscroll;
      };
    }
  }, [isLocked]);
}
