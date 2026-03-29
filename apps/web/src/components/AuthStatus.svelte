<!--
  AuthStatus Component
  
  Example component showing API client usage and auth state.
-->
<script lang="ts">
  import { Button, Spinner } from '@repo/ui';
  import { authStore, isAuthenticated } from '../stores/auth';

  let loading = $state(false);
  let error = $state<string | null>(null);
  let currentAuth = $state(false);
  let currentUser = $state<{ email: string } | null>(null);

  // Subscribe to stores
  $effect(() => {
    const unsubAuth = isAuthenticated.subscribe(v => currentAuth = v);
    const unsubUser = authStore.subscribe(s => currentUser = s.user);
    return () => {
      unsubAuth();
      unsubUser();
    };
  });

  const checkAuth = async () => {
    loading = true;
    error = null;
    
    try {
      // This would normally call the actual API
      // await authStore.checkAuth();
      
      // Simulated for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      error = 'Not authenticated (demo mode)';
    } catch (e) {
      error = e instanceof Error ? e.message : 'An error occurred';
    } finally {
      loading = false;
    }
  };
</script>

<div class="space-y-4">
  {#if loading}
    <div class="flex items-center gap-2 text-gray-600">
      <Spinner size="sm" />
      <span>Checking auth status...</span>
    </div>
  {:else if currentAuth && currentUser}
    <div class="space-y-2">
      <p class="text-green-600 dark:text-green-400">
        ✓ Authenticated as {currentUser.email}
      </p>
      <Button variant="outline" size="sm" onclick={() => authStore.logout()}>
        Logout
      </Button>
    </div>
  {:else}
    <div class="space-y-2">
      {#if error}
        <p class="text-amber-600 dark:text-amber-400 text-sm">{error}</p>
      {/if}
      <Button variant="primary" size="sm" onclick={checkAuth}>
        Check Auth Status
      </Button>
    </div>
  {/if}
</div>
