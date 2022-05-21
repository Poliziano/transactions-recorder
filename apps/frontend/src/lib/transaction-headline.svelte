<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import IconButton from "./components/icon-button.svelte";
  import type { TransactionFormParams } from "./transaction-form";
  const dispatch = createEventDispatcher<{
    openTransactionForm: Pick<TransactionFormParams, "date">;
  }>();
</script>

<div class="card">
  <h2>Transactions</h2>
  <div />
  <IconButton
    src="add_alt.svg"
    alt="Add transaction"
    type="primary"
    on:click={() =>
      dispatch("openTransactionForm", {
        date: new Date().toISOString().split("T")[0],
      })}
  />
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
</style>
