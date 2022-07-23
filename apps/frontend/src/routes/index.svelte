<script lang="ts">
  import TransactionForm from "$lib/transaction-form.svelte";
  import TransactionTable from "$lib/transaction-table.svelte";
  import { useMachine } from "@xstate/svelte";
  import createTransactionPageMachine from "../lib/state/transaction-page.machine";

  const machine = createTransactionPageMachine();
  const { service } = useMachine(machine);

  $: context = $service.context;
</script>

<div class="layout">
  <TransactionTable {service} on:delete={() => {}} />
  <TransactionForm service={context.form} />
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
