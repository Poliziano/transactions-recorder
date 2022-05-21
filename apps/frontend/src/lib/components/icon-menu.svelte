<script lang="ts">
  import IconButton from "./icon-button.svelte";
  import Block from "./block.svelte";

  export let actions: { text: string; click: () => void }[];
  let show = false;
</script>

<div>
  <IconButton
    src="more_horizontal.svg"
    alt="Transaction options"
    on:click={() => (show = true)}
  />
  {#if show && actions.length > 0}
    <Block on:click={() => (show = false)} />
    <div class="dropdown" on:click={() => (show = false)}>
      {#each actions as { text, click }}
        <button on:click={click}>{text}</button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .dropdown {
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: white;
    box-shadow: 2px 2px 10px rgb(225, 225, 225);
    border: 1px solid rgb(215, 215, 215);
    border-radius: 5px;
  }

  button {
    margin: 0;
    padding: 10px;
    font: inherit;
    border: none;
    background-color: unset;
    text-align: left;
  }
  button:hover {
    background-color: rgb(235, 235, 235);
  }
  button:active {
    background-color: rgb(215, 215, 215);
  }
  button:not(:last-child) {
    border-bottom: 1px solid #f1f1f1;
  }
</style>
