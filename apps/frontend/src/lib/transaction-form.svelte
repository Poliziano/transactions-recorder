<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { TransactionEntityCreateParams } from "../api/transaction";

  const dispatch = createEventDispatcher<{
    create: TransactionEntityCreateParams;
    cancel: void;
  }>();

  function handleSubmit(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);

    dispatch("create", {
      name: formData.get("name") as string,
      amount: +(formData.get("amount") as string),
      date: new Date(formData.get("date") as string).toISOString(),
      type: formData.get("type") as "income" | "expenditure",
    });
  }

  function handleCancel() {
    dispatch("cancel");
  }
</script>

<div class="blocker" on:click={handleCancel}>
  <form
    class="new-transaction-form"
    on:click|stopPropagation
    on:submit|preventDefault={handleSubmit}
  >
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
    <div class="new-transaction-form-buttons">
      <input type="submit" value="Submit" />
      <input type="button" value="Cancel" on:click={handleCancel} />
    </div>
  </form>
</div>

<style>
  input,
  select {
    font: inherit;
    appearance: none;
    margin: 2px;
    padding: 10px;
    border: 1px solid rgb(215, 215, 215);
    border-radius: 5px;
  }

  input[type="submit"],
  input[type="button"] {
    background-color: white;
  }

  .new-transaction-form {
    position: absolute;
    display: flex;
    gap: 5px;
    flex-direction: column;
    width: 350px;
    height: min-content;
    padding: 10px;
    background-color: white;
    left: 0;
    right: 0;
    top: 10vh;
    margin: auto;
    box-shadow: 2px 2px 10px rgb(225, 225, 225);
    border: 1px solid rgb(215, 215, 215);
    border-radius: 5px;
    z-index: 1000;
  }

  .new-transaction-form-buttons {
    display: flex;
    justify-content: center;
  }

  .blocker {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
