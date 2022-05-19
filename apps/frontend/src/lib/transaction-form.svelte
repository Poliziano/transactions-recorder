<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { TransactionEntityCreateParams } from "../api/transaction";

  const dispatch = createEventDispatcher<{
    create: TransactionEntityCreateParams;
  }>();

  async function handleSubmit(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);

    dispatch("create", {
      name: formData.get("name") as string,
      amount: +(formData.get("amount") as string),
      date: new Date(formData.get("date") as string).toISOString(),
      type: formData.get("type") as "income" | "expenditure",
    });
  }
</script>

<form class="new-transaction-form" on:submit|preventDefault={handleSubmit}>
  <input name="name" type="text" placeholder="Name" required />
  <input name="amount" type="number" placeholder="Amount" required />
  <input
    name="date"
    type="date"
    value={new Date().toISOString().split("T")[0]}
    required
  />
  <select name="type" required>
    <option value="expenditure" default>Expenditure</option>
    <option value="income">Income</option>
  </select>
  <input type="submit" placeholder="Submit" />
</form>

<style>
  .new-transaction-form {
    display: flex;
    flex-direction: column;
    width: 350px;
    padding: 10px;
  }
</style>
