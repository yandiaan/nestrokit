<!--
  Input Component
  
  A text input with label, error state, and helper text support.
  
  @example
  <Input
    label="Email"
    type="email"
    placeholder="you@example.com"
    error={errors.email}
    bind:value={email}
  />
-->
<script lang="ts">
  import { clsx } from 'clsx';

  interface Props {
    /** Input value (bindable) */
    value?: string;
    /** Input type */
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
    /** Input name */
    name?: string;
    /** Input id */
    id?: string;
    /** Label text */
    label?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Helper text */
    helper?: string;
    /** Error message */
    error?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Required field */
    required?: boolean;
    /** Read-only state */
    readonly?: boolean;
    /** Additional CSS classes */
    class?: string;
    /** Input handler */
    oninput?: (event: Event) => void;
    /** Blur handler */
    onblur?: (event: FocusEvent) => void;
  }

  let {
    value = $bindable(''),
    type = 'text',
    name,
    id,
    label,
    placeholder,
    helper,
    error,
    disabled = false,
    required = false,
    readonly = false,
    class: className = '',
    oninput,
    onblur,
  }: Props = $props();

  const inputId = $derived(id || name || `input-${Math.random().toString(36).slice(2, 9)}`);
  const hasError = $derived(!!error);

  const inputClass = $derived(
    clsx(
      'block w-full rounded-lg border px-3 py-2 text-sm transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      'dark:bg-gray-800 dark:text-gray-100',
      hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600',
      className,
    )
  );
</script>

<div class="space-y-1">
  {#if label}
    <label for={inputId} class="block text-sm font-medium text-gray-700 dark:text-gray-200">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}

  <input
    type={type}
    {name}
    id={inputId}
    {placeholder}
    {disabled}
    {required}
    {readonly}
    class={inputClass}
    {value}
    oninput={(e) => {
      value = (e.target as HTMLInputElement).value;
      oninput?.(e);
    }}
    {onblur}
  />

  {#if error}
    <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
  {:else if helper}
    <p class="text-sm text-gray-500 dark:text-gray-400">{helper}</p>
  {/if}
</div>
