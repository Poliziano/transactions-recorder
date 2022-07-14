<script lang="ts">
  import type { createTransactionsOnDateMachine } from "$lib/state/transactions-on-date.machine";
  import { slide } from "svelte/transition";
  import type { ActorRefFrom } from "xstate";
  import IconButton from "./components/icon-button.svelte";
  import Transaction from "./transaction.svelte";

  export let service: ActorRefFrom<
    ReturnType<typeof createTransactionsOnDateMachine>
  >;

  $: context = $service.context;

  $: icon = $service.matches("displayingTransactions")
    ? "expand_less.svg"
    : "expand_more.svg";

  function handleClick() {
    const event = $service.matches("displayingTransactions")
      ? "CLOSE_TRANSACTIONS"
      : "FETCH_TRANSACTIONS";

    service.send(event);
  }

  function handleFormOpen() {
    service.send({
      type: "OPEN_TRANSACTIONS_FORM",
      data: {
        date: new Date(context.date).toISOString().split("T")[0],
      },
    });
  }
</script>

<div class="card">
  <IconButton src={icon} alt="Expand transactions" on:click={handleClick} />
  <h2>{new Date(context.date).toLocaleDateString()}</h2>
  <div class="amount">£{context.total}</div>
  <IconButton src="add.svg" alt="Add transaction" on:click={handleFormOpen} />
</div>

{#if $service.matches("displayingTransactions")}
  <div transition:slide|local>
    {#each Object.entries(context.transactions) as [uuid, service] (uuid)}
      <div class="transaction" transition:slide|local>
        <Transaction on:delete {service} />
      </div>
    {/each}
  </div>
{/if}

<style>
  h2 {
    padding: 0;
    margin: 0;
    font: var(--font-h2);
  }
  .card {
    width: 100%;
    display: grid;
    grid-template-columns: var(--grid-transaction-column-template);
    gap: var(--grid-gap-0);
    align-items: center;
    box-sizing: border-box;
    padding: 10px 20px;
    background-color: white;
  }
  .amount {
    font: var(--font-h2);
  }
  .transaction:not(:last-child) {
    border-bottom: 1px solid #f1f1f1;
  }
</style>
