<script lang="ts">
  import type { TransactionEntity } from "src/api/transaction";
  import Transaction from "./transaction.svelte";
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import IconButton from "./components/icon-button.svelte";

  export let date: string;
  export let records: TransactionEntity[];

  const dispatch = createEventDispatcher<{
    openTransactionForm: void;
  }>();

  let expanded = true;

  function aggregateTransactions(transactions: TransactionEntity[]): number {
    return transactions.reduce(
      (previous, current) => previous + current.amount,
      0
    );
  }
</script>

<div class="card">
  <IconButton
    src={expanded ? "expand_less.svg" : "expand_more.svg"}
    alt="Expand transactions"
    on:click={() => (expanded = !expanded)}
  />
  <h2>{new Date(date).toLocaleDateString()}</h2>
  <div class="amount">£{aggregateTransactions(records)}</div>
  <IconButton
    src="add.svg"
    alt="Add transaction"
    on:click={() => dispatch("openTransactionForm")}
  />
</div>

{#each records as transaction (transaction.uuid)}
  {#if expanded}
    <div class="transaction" transition:slide|local>
      <Transaction on:delete {transaction} />
    </div>
  {/if}
{/each}

<style>
  h2 {
    padding: 0;
    margin: 0;
    font: var(--font-h2);
  }
  .card {
    width: 100%;
    display: grid;
    grid-template-columns: var(--grid-transaction-column-template);
    gap: var(--grid-gap-0);
    align-items: center;
    box-sizing: border-box;
    padding: 10px 20px;
    background-color: white;
  }
  .amount {
    font: var(--font-h2);
  }
  .transaction:not(:last-child) {
    border-bottom: 1px solid #f1f1f1;
  }
</style>
