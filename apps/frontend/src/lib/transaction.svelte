<script lang="ts">
  import type { TransactionEntity } from "$lib/api/transaction";
  import { createEventDispatcher } from "svelte";
  import IconMenu from "./components/icon-menu.svelte";

  export let transaction: TransactionEntity;

  const dispatch = createEventDispatcher<{ delete: TransactionEntity }>();
  const actions = [
    {
      text: "Delete",
      click: () => dispatch("delete", transaction),
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
