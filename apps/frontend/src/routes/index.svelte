<script lang="ts">
  import TransactionForm from "$lib/transaction-form.svelte";
  import TransactionTable from "$lib/transaction-table.svelte";
  import { useMachine, useSelector } from "@xstate/svelte";
  import createTransactionPageMachine from "../lib/state/transaction-page.machine";

  const machine = createTransactionPageMachine();
  const { service } = useMachine(machine);
  const context = useSelector(service, (state) => state.context);
</script>

<div class="layout">
  <TransactionTable {service} on:delete={() => {}} />
  <TransactionForm service={$context.form} />
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
