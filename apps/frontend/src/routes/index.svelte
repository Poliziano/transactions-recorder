<script lang="ts">
  import TransactionTable from "$lib/transaction-table.svelte";
  import {
    createTransaction,
    fetchTransactionsDailySum,
  } from "../lib/state/transactions.service";
  import createTransactionPageMachine from "../lib/state/transaction-page.machine";
  import { useMachine } from "@xstate/svelte";
  import TransactionForm from "$lib/transaction-form.svelte";

  const machine = createTransactionPageMachine();
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
