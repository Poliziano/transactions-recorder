<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import IconButton from "./components/icon-button.svelte";

  export let date: string;
  export let amount: number;

  const dispatch = createEventDispatcher<{
    openTransactionForm: void;
  }>();
</script>

<div class="card">
  <div>
    <img class="dropdown" src="expand_more.svg" alt="Expand transactions" />
  </div>
  <h2>{new Date(date).toLocaleDateString()}</h2>
  <div class="amount">£{amount}</div>
  <IconButton
    src="add.svg"
    alt="Add transaction"
    on:click={() => dispatch("openTransactionForm")}
  />
</div>

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
  .dropdown {
    display: flex;
    width: 100%;
  }
  .amount {
    font: var(--font-h2);
  }
</style>
