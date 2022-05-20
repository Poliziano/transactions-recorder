<script lang="ts">
  import type { TransactionEntity } from "src/api/transaction";
  import { createEventDispatcher } from "svelte";

  export let transaction: TransactionEntity;

  const dispatch = createEventDispatcher<{ delete: TransactionEntity }>();
  function deleteClicked() {
    dispatch("delete", transaction);
  }
</script>

<div class="card">
  <div>
    <img class="actions" src="more_horizontal.svg" alt="Transaction options" />
  </div>
  <div>{transaction.name}</div>
  <div>{transaction.amount}</div>
  <div class="user">J</div>
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
  .actions {
    display: flex;
    width: 100%;
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
