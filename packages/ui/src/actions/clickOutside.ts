/**
 * Click Outside Action
 *
 * Triggers a callback when clicking outside the element.
 *
 * @example
 * <div use:clickOutside={() => open = false}>
 *   Dropdown content
 * </div>
 */
import type { Action } from 'svelte/action';

export const clickOutside: Action<HTMLElement, () => void> = (node, callback) => {
  const handleClick = (event: MouseEvent) => {
    if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
      callback();
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
  };
};
