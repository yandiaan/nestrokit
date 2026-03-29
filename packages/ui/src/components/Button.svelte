<!--
  Button Component
  
  A versatile button with multiple variants, sizes, and states.
  
  @example
  <Button variant="primary" size="md" on:click={handleClick}>
    Click me
  </Button>
  
  <Button variant="outline" loading={true}>
    Processing...
  </Button>
-->
<script lang="ts">
  import { clsx } from 'clsx';

  interface Props {
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Full width button */
    fullWidth?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Loading state */
    loading?: boolean;
    /** Button type */
    type?: 'button' | 'submit' | 'reset';
    /** Additional CSS classes */
    class?: string;
    /** Click handler */
    onclick?: (event: MouseEvent) => void;
  }

  let {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    type = 'button',
    class: className = '',
    onclick,
  }: Props = $props();

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:hover:bg-gray-800',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  const buttonClass = $derived(
    clsx(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      className,
    )
  );
</script>

<button
  {type}
  class={buttonClass}
  disabled={disabled || loading}
  {onclick}
>
  {#if loading}
    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  {/if}
  <slot />
</button>
