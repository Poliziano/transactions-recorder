<script lang="ts">
  import TransactionForm from "$lib/transaction-form.svelte";
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

  async function handleCreateTransaction(
    event: CustomEvent<TransactionEntityCreateParams>
  ) {
    service.send({
      type: "CREATE_TRANSACTION",
      data: event.detail,
    });
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
  <TransactionTable
    transactions={context.transactions}
    on:delete={handleDeleteTransaction}
  />
  <TransactionForm on:create={handleCreateTransaction} />
</div>

<style>
  .layout {
    display: flex;
  }
</style>
