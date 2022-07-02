<script lang="ts">
  import TransactionTable from "$lib/transaction-table.svelte";
  import { fetchTransactionsDailySum } from "../state/transactions.service";
  import createAggregatedDailyTransactionsMachine from "../state/aggregated-daily-transactions.machine";
  import { useMachine } from "@xstate/svelte";

  const machine = createAggregatedDailyTransactionsMachine({
    fetchTransactions: fetchTransactionsDailySum,
  });
  const { service } = useMachine(machine);
</script>

<div class="layout">
  <TransactionTable
    {service}
    on:delete={() => {}}
    on:openTransactionForm={(event) => {}}
  />
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
