<script lang="ts">
  import type { ActorRefFrom } from "xstate";
  import type createTransactionPageMachine from "./state/transaction-page.machine";
  import TransactionGroup from "./transaction-group.svelte";

  export let service: ActorRefFrom<
    ReturnType<typeof createTransactionPageMachine>
  >;

  $: context = $service.context;
  service.send("FETCH_TRANSACTIONS");
</script>

<div class="content-scroll-wrap">
  <div class="container">
    {#each Object.entries(context.dates) as [date, service] (date)}
      <TransactionGroup {service} on:openTransactionForm on:delete />
    {/each}
  </div>
</div>

<style>
  .content-scroll-wrap {
    position: relative;
    height: 100%;
  }
  .container {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
  }
</style>
