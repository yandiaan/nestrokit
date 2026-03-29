/**
 * Tooltip Action
 *
 * Adds a tooltip to an element.
 *
 * @example
 * <button use:tooltip={{ content: 'Click to submit', position: 'top' }}>
 *   Submit
 * </button>
 */
import type { Action } from 'svelte/action';

export interface TooltipOptions {
  /** Tooltip text content */
  content: string;
  /** Position relative to element */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing (ms) */
  delay?: number;
}

export const tooltip: Action<HTMLElement, TooltipOptions> = (node, options) => {
  let tooltipEl: HTMLDivElement | null = null;
  let showTimeout: ReturnType<typeof setTimeout>;

  const createTooltip = () => {
    tooltipEl = document.createElement('div');
    tooltipEl.className = `
      fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 
      rounded shadow-lg pointer-events-none transition-opacity duration-150
      dark:bg-gray-700
    `;
    tooltipEl.textContent = options.content;
    tooltipEl.style.opacity = '0';
    document.body.appendChild(tooltipEl);
  };

  const positionTooltip = () => {
    if (!tooltipEl) return;

    const rect = node.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const position = options.position || 'top';
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - tooltipRect.height - gap;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + gap;
        break;
    }

    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;
  };

  const show = () => {
    showTimeout = setTimeout(() => {
      createTooltip();
      positionTooltip();
      if (tooltipEl) {
        tooltipEl.style.opacity = '1';
      }
    }, options.delay || 200);
  };

  const hide = () => {
    clearTimeout(showTimeout);
    if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }
  };

  node.addEventListener('mouseenter', show);
  node.addEventListener('mouseleave', hide);
  node.addEventListener('focus', show);
  node.addEventListener('blur', hide);

  return {
    update(newOptions) {
      options = newOptions;
      if (tooltipEl) {
        tooltipEl.textContent = newOptions.content;
        positionTooltip();
      }
    },
    destroy() {
      hide();
      node.removeEventListener('mouseenter', show);
      node.removeEventListener('mouseleave', hide);
      node.removeEventListener('focus', show);
      node.removeEventListener('blur', hide);
    },
  };
};
