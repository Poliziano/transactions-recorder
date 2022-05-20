<script lang="ts">
  import type { TransactionEntity } from "src/api/transaction";
  import TransactionDate from "./transaction-date.svelte";
  import Transaction from "./transaction.svelte";

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

  function aggregateTransactions(transactions: TransactionEntity[]): number {
    return transactions.reduce(
      (previous, current) => previous + current.amount,
      0
    );
  }
</script>

<div class="content-scroll-wrap">
  <div class="container">
    {#each Object.entries(transactionsByDate) as [date, record]}
      <TransactionDate {date} amount={aggregateTransactions(record)} />
      <div class="transactions">
        {#each record as transaction}
          <div class="transaction">
            <Transaction on:delete {transaction} />
          </div>
        {/each}
      </div>
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
  .transactions {
    display: flex;
    flex-direction: column;
    border-radius: 20px;
  }
  .transaction:not(:last-child) {
    border-bottom: 1px solid #f1f1f1;
  }
</style>
