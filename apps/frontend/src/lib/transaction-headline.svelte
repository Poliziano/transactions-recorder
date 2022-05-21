<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher<{
    openTransactionForm: void;
  }>();
</script>

<div class="card">
  <h2>Transactions</h2>
  <div />
  <button class="action" on:click={() => dispatch("openTransactionForm")}>
    <img class="action-icon" src="add.svg" alt="Add transaction" />
  </button>
</div>

<style>
  h2 {
    padding: 0;
    margin: 0;
    font: var(--font-h1);
  }
  .card {
    width: 100%;
    display: grid;
    grid-template-columns: min-content auto 24px;
    gap: var(--grid-gap-0);
    align-items: center;
    box-sizing: border-box;
    padding: 15px 20px;
  }
  .action {
    margin: 0;
    padding: 0;
    border: none;
    background-color: unset;
  }
  .action-icon {
    display: flex;
    width: 100%;
  }
</style>
