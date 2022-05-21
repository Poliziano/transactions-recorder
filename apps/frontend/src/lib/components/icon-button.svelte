<script lang="ts">
  export let src: string;
  export let alt: string;
  export let type: "primary" | "secondary" = "secondary";
</script>

<button on:click class:primary={type === "primary"}>
  <img {src} {alt} />
</button>

<style>
  button {
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 5px;
    background-color: unset;
    height: 24px;
    width: 24px;
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
  .primary {
    background-color: #464646;
  }
  .primary:hover {
    background-color: #555555;
  }
  .primary:active {
    background-color: #666666;
  }
</style>
