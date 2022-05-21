<script lang="ts">
  export let src: string;
  export let alt: string;
</script>

<button on:click>
  <img {src} {alt} />
</button>

<style>
  button {
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 5px;
    background-color: unset;
  }
  button:hover {
    background-color: rgb(235, 235, 235);
  }
  button:active {
    background-color: rgb(215, 215, 215);
  }
  img {
    display: flex;
    width: 100%;
  }
</style>
