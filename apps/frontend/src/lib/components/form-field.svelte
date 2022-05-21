<script lang="ts">
  export let name: string = "";
  export let type: "text" | "number" | "date" | "submit" | "button";
  export let placeholder: string = "";
  export let required: boolean = true;
  export let value: string = "";
</script>

<input {name} {type} {placeholder} {value} {required} on:click />

<style>
  input {
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

  input[type="submit"]:hover,
  input[type="button"]:hover {
    background-color: rgb(235, 235, 235);
  }
</style>
