<script lang="ts">
  import TransactionForm from "$lib/transaction-form.svelte";
  import TransactionHeadline from "$lib/transaction-headline.svelte";
  import TransactionTable from "$lib/transaction-table.svelte";
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

  let newTransactionForm = false;

  async function handleCreateTransaction(
    event: CustomEvent<TransactionEntityCreateParams>
  ) {
    service.send({
      type: "CREATE_TRANSACTION",
      data: event.detail,
    });
    newTransactionForm = false;
  }

  async function handleDeleteTransaction(
    event: CustomEvent<TransactionEntity>
  ) {
    service.send({
      type: "DELETE_TRANSACTION",
      data: event.detail,
    });
  }
</script>

<div class="layout">
  <TransactionHeadline
    on:openTransactionForm={() => (newTransactionForm = true)}
  />
  <TransactionTable
    transactions={context.transactions}
    on:delete={handleDeleteTransaction}
    on:openTransactionForm={() => (newTransactionForm = true)}
  />

  {#if newTransactionForm}
    <TransactionForm
      on:create={handleCreateTransaction}
      on:close={() => (newTransactionForm = false)}
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
