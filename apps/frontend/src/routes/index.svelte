<script lang="ts">
  import TransactionTable from "$lib/transaction-table.svelte";
  import {
    createTransaction,
    fetchTransactionsDailySum,
  } from "../state/transactions.service";
  import createAggregatedDailyTransactionsMachine from "../state/aggregated-daily-transactions.machine";
  import { useMachine } from "@xstate/svelte";
  import TransactionForm from "$lib/transaction-form.svelte";

  const machine = createAggregatedDailyTransactionsMachine({
    fetchTransactions: fetchTransactionsDailySum,
    createTransaction,
  });
  const { send, service } = useMachine(machine);
</script>

<div class="layout">
  <TransactionTable {service} on:delete={() => {}} />

  {#if $service.context.form != null}
    <TransactionForm
      transaction={$service.context.form}
      on:close={() => send("CLOSE_TRANSACTION_FORM")}
      on:create={(event) =>
        send({ type: "SUBMIT_TRANSACTION_FORM", data: event.detail })}
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
