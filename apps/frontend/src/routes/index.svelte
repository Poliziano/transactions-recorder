<script lang="ts">
	import Transaction from '$lib/transaction.svelte';

	let transactions: { name: string }[] = [];

	(async function () {
		const url =
			'https://w3nezq09u5.execute-api.eu-west-2.amazonaws.com/prod/users/abc/transactions';
		const response = await fetch(url, {
			method: 'GET'
		});

		if (response.ok) {
			const json = await response.json();
			transactions = json.transactions;
		}
	})();
</script>

<ul>
	{#each transactions as { name }}
		<li><Transaction {name} /></li>
	{/each}
</ul>
