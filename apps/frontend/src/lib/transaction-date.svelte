<script lang="ts">
  export let date: string;
  export let amount: number;
</script>

<div class="card">
  <div>
    <img class="dropdown" src="expand_more.svg" alt="Expand transactions" />
  </div>
  <h2>{new Date(date).toLocaleDateString()}</h2>
  <div class="amount">£{amount}</div>
  <div>
    <img class="action" src="add.svg" alt="Add transaction" />
  </div>
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
  .action {
    display: flex;
    width: 100%;
  }
  .amount {
    font: var(--font-h2);
  }
</style>
