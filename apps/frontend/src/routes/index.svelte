<script lang="ts">
  import type { TransactionFormParams } from "$lib/transaction-form";

  import TransactionForm from "$lib/transaction-form.svelte";
  import TransactionHeadline from "$lib/transaction-headline.svelte";
  import TransactionTable from "$lib/transaction-table.svelte";
  import { aggregateTransactions } from "$lib/transactions";
  import { interpret } from "xstate";
  import type {
    TransactionEntity,
    TransactionEntityCreateParams,
  } from "../api/transaction";
  import { createTransactionsMachine } from "../state/transactions.machine";
  import {
    fetchTransactions,
    createTransaction,
    deleteTransaction,
  } from "../state/transactions.service";

  const machine = createTransactionsMachine({
    fetchTransactions,
    createTransaction,
    deleteTransaction,
  });
  const service = interpret(machine).start();
  service.send("FETCH_TRANSACTIONS");
  $: context = $service.context;

  let transactionForm: TransactionFormParams | null = null;

  function handleCreateTransaction(
    event: CustomEvent<TransactionEntityCreateParams>
  ) {
    service.send({
      type: "CREATE_TRANSACTION",
      data: event.detail,
    });
  }

  function handleDeleteTransaction(event: CustomEvent<TransactionEntity>) {
    service.send({
      type: "DELETE_TRANSACTION",
      data: event.detail,
    });
  }
</script>

<div class="layout">
  <TransactionHeadline
    total={aggregateTransactions(context.transactions)}
    on:openTransactionForm={(event) => (transactionForm = event.detail)}
  />
  <TransactionTable
    transactions={context.transactions}
    on:delete={handleDeleteTransaction}
    on:openTransactionForm={(event) => (transactionForm = event.detail)}
  />

  {#if transactionForm}
    <TransactionForm
      transaction={transactionForm}
      on:create={handleCreateTransaction}
      on:close={() => (transactionForm = null)}
    />
  {/if}
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
