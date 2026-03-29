<!--
  Counter Component
  
  Example Svelte island component demonstrating client-side interactivity.
-->
<script lang="ts">
  import { Button } from '@repo/ui';

  let count = $state(0);
  
  const increment = () => count++;
  const decrement = () => count--;
  const reset = () => count = 0;
</script>

<div class="flex flex-col items-center gap-4">
  <div class="text-5xl font-bold tabular-nums">{count}</div>
  
  <div class="flex gap-2">
    <Button variant="outline" size="sm" onclick={decrement}>
      -
    </Button>
    <Button variant="secondary" size="sm" onclick={reset}>
      Reset
    </Button>
    <Button variant="outline" size="sm" onclick={increment}>
      +
    </Button>
  </div>
</div>
