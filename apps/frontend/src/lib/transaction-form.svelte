<script lang="ts">
  import { actorController } from "$lib/actions/actor-controller";
  import "$lib/components/form-field.css";
  import { useSelector } from "@xstate/svelte";
  import { fly } from "svelte/transition";
  import type { ActorRefFrom } from "xstate";
  import Block from "./components/block.svelte";
  import ErrorMessage from "./components/error-message.svelte";
  import type { createTransactionsFormMachine } from "./state/transactions-form.machine";

  export let actor: ActorRefFrom<typeof createTransactionsFormMachine>;
  const formError = useSelector(actor, (state) => state.context.error);
  const submitting = useSelector(actor, (state) => state.matches("submitting"));
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
        <input type="submit" value="Submit" disabled={$submitting} />
        <input
          type="button"
          value="Cancel"
          disabled={$submitting}
          on:click={() => actor.send("CLOSE")}
        />
      </div>

      <ErrorMessage message={$formError} />
    </form>
  </Block>
{/if}

<style>
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
    border-radius: var(--border-radius-0);
    z-index: 1000;
  }

  .new-transaction-form-buttons {
    display: flex;
    justify-content: center;
  }
</style>
