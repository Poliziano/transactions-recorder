<script lang="ts">
  export let message: string | null = null;
</script>

{#if message}
  <div>{message}</div>
{/if}

<style>
  div {
    padding: 20px;
    background-color: rgb(255, 220, 220);
    border-radius: var(--border-radius-0);
    text-align: center;
  }
</style>
