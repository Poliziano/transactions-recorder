<script lang="ts">
  import type { TransactionEntity } from "src/api/transaction";
  import TransactionGroup from "./transaction-group.svelte";

  export let transactions: TransactionEntity[] = [];
  $: transactionsByDate = transactions.reduce(function (
    previousValue,
    currentValue
  ) {
    const groupedTransactions = previousValue[currentValue.date] ?? [];
    previousValue[currentValue.date] = [...groupedTransactions, currentValue];
    return previousValue;
  },
  {} as Record<string, TransactionEntity[]>);
</script>

<div class="content-scroll-wrap">
  <div class="container">
    {#each Object.entries(transactionsByDate) as [date, records] (date)}
      <TransactionGroup {date} {records} on:openTransactionForm on:delete />
    {/each}
  </div>
</div>

<style>
  .content-scroll-wrap {
    position: relative;
    height: 100%;
  }
  .container {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
  }
</style>
