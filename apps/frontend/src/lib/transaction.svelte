<script lang="ts">
  import type { ActorRefFrom } from "xstate";
  import IconMenu from "./components/icon-menu.svelte";
  import type { createTransactionMachine } from "./state/transaction.machine";

  export let service: ActorRefFrom<ReturnType<typeof createTransactionMachine>>;

  $: context = $service.context;
  $: transaction = context.transaction;

  const actions = [
    {
      text: "Delete",
      click: () => service.send("DELETE"),
    },
  ];
</script>

<div class="card">
  <IconMenu {actions} />
  <div>{transaction.name}</div>
  <div>£{transaction.amount}</div>
  <!-- <div class="user">J</div> -->
</div>

<style>
  .card {
    width: 100%;
    display: grid;
    grid-template-columns: var(--grid-transaction-column-template);
    gap: var(--grid-gap-0);
    align-items: center;
    box-sizing: border-box;
    padding: 15px 20px;
  }
  .user {
    display: flex;
    width: 100%;
    height: 100%;
    color: white;
    background-color: #464646;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
</style>
