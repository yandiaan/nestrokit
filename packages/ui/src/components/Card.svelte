<!--
  Card Component
  
  A container component with optional header and footer.
  
  @example
  <Card>
    <Card.Header>Title</Card.Header>
    <p>Content goes here</p>
    <Card.Footer>Footer content</Card.Footer>
  </Card>
-->
<script lang="ts">
  import { clsx } from 'clsx';

  interface Props {
    /** Card padding */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    class?: string;
  }

  let {
    padding = 'md',
    class: className = '',
  }: Props = $props();

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const cardClass = $derived(
    clsx(
      'bg-white rounded-xl shadow-sm border border-gray-200',
      'dark:bg-gray-800 dark:border-gray-700',
      paddingStyles[padding],
      className,
    )
  );
</script>

<div class={cardClass}>
  <slot />
</div>
