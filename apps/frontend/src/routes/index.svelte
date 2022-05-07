<script lang="ts">
	import TransactionForm from '$lib/transaction-form.svelte';
	import TransactionTable from '$lib/transaction-table.svelte';
	import type { TransactionEntity } from 'src/api/transaction';

	let transactions: TransactionEntity[] = [];

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

<div class="layout">
	<TransactionTable {transactions} />
	<TransactionForm />
</div>

<style>
	.layout {
		display: flex;
	}
</style>
