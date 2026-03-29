/**
 * Focus Trap Action
 *
 * Traps focus within an element (useful for modals/dialogs).
 *
 * @example
 * <div use:focusTrap>
 *   Modal content with focusable elements
 * </div>
 */
import type { Action } from 'svelte/action';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export const focusTrap: Action<HTMLElement, boolean | undefined> = (node, enabled = true) => {
  const getFocusableElements = (): HTMLElement[] => {
    return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const activate = () => {
    node.addEventListener('keydown', handleKeyDown);
    // Focus first focusable element
    const focusable = getFocusableElements();
    const first = focusable[0];
    if (first) {
      first.focus();
    }
  };

  const deactivate = () => {
    node.removeEventListener('keydown', handleKeyDown);
  };

  if (enabled) {
    activate();
  }

  return {
    update(newEnabled) {
      if (newEnabled) {
        activate();
      } else {
        deactivate();
      }
    },
    destroy() {
      deactivate();
    },
  };
};
