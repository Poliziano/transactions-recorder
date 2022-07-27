<script lang="ts">
  import { actorController } from "$lib/actions/actor-controller";
  import "$lib/components/form-field.css";
  import { fly } from "svelte/transition";
  import type { ActorRefFrom } from "xstate";
  import Block from "./components/block.svelte";
  import type { createTransactionsFormMachine } from "./state/transactions-form.machine";

  export let actor: ActorRefFrom<typeof createTransactionsFormMachine>;
</script>

{#if !$actor.matches("closed")}
  <Block on:click={() => actor.send("CLOSE")}>
    <form
      class="new-transaction-form"
      on:click|stopPropagation
      on:submit|preventDefault={() => actor.send("SUBMIT")}
      transition:fly={{ y: 25 }}
    >
      <input
        name="name"
        type="text"
        placeholder="Name"
        required
        use:actorController={{ actor, send: "UPDATE_NAME" }}
      />
      <input
        name="amount"
        type="number"
        inputmode="numeric"
        placeholder="Amount"
        min="0"
        step="0.01"
        required
        use:actorController={{ actor, send: "UPDATE_AMOUNT" }}
      />
      <input
        name="date"
        type="date"
        required
        use:actorController={{ actor, send: "UPDATE_DATE" }}
      />
      <select
        name="type"
        use:actorController={{ actor, send: "UPDATE_TYPE" }}
        required
      >
        <option value="expenditure" default>Expenditure</option>
        <option value="income">Income</option>
      </select>
      <div class="new-transaction-form-buttons">
        <input type="submit" value="Submit" />
        <input
          type="button"
          value="Cancel"
          on:click={() => actor.send("CLOSE")}
        />
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
