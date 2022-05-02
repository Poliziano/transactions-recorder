<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<script lang="ts">
  (async function() {
    const url = "https://w3nezq09u5.execute-api.eu-west-2.amazonaws.com/prod/users/abc/transactions";
    const transactions = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        "date": "2020-01-01",
        "name": "McDonalds",
        "amount": 12.50,
        "type": "expenditure"
      })
    });
    console.log(transactions);
  })();
</script>