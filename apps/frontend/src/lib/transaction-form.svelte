<script lang="ts">
  import { actor } from "$lib/actor";
  import "$lib/components/form-field.css";
  import { fly } from "svelte/transition";
  import type { ActorRefFrom } from "xstate";
  import Block from "./components/block.svelte";
  import type { createTransactionsFormMachine } from "./state/transactions-form.machine";

  export let service: ActorRefFrom<
    ReturnType<typeof createTransactionsFormMachine>
  >;

  $: transaction = $service.context;

  function handleSubmit() {
    service.send("SUBMIT");
  }

  function handleClose() {
    service.send("CLOSE");
  }
</script>

{#if !$service.matches("closed")}
  <Block on:click={handleClose}>
    <form
      class="new-transaction-form"
      on:click|stopPropagation
      on:submit|preventDefault={handleSubmit}
      transition:fly={{ y: 25 }}
    >
      <input
        name="name"
        type="text"
        placeholder="Name"
        required
        use:actor={{ service, type: "UPDATE_NAME" }}
      />
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        required
        use:actor={{ service, type: "UPDATE_AMOUNT" }}
      />
      <input
        name="date"
        type="date"
        required
        use:actor={{ service, type: "UPDATE_DATE" }}
      />
      <select name="type" use:actor={{ service, type: "UPDATE_TYPE" }} required>
        <option
          value="expenditure"
          default
          selected={transaction.type === "expenditure"}>Expenditure</option
        >
        <option value="income" selected={transaction.type === "income"}
          >Income</option
        >
      </select>
      <div class="new-transaction-form-buttons">
        <input type="submit" value="Submit" />
        <input type="button" value="Cancel" on:click={handleClose} />
      </div>
    </form>
  </Block>
{/if}

<style>
  select {
    font: inherit;
    appearance: none;
    margin: 2px;
    padding: 10px;
    border: 1px solid rgb(215, 215, 215);
    border-radius: 5px;
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
</style>
