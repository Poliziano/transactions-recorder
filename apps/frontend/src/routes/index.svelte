<script lang="ts">
	import TransactionForm from '$lib/transaction-form.svelte';
	import TransactionTable from '$lib/transaction-table.svelte';
	import { derived, writable } from 'svelte/store';
	import { endpoint } from '../api/api';
	import type { TransactionEntity, TransactionEntityCreateParams } from '../api/transaction';

	const transactions = writable<TransactionEntity[]>([]);

	(async function () {
		const url = `${endpoint}/users/abc/transactions`;
		const response = await fetch(url, {
			method: 'GET'
		});

		if (response.ok) {
			const json = await response.json();
			transactions.set(json.transactions);
		}
	})();

	async function handleCreateTransaction(event: CustomEvent<TransactionEntityCreateParams>) {
		const url = `${endpoint}/users/abc/transactions`;

		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(event.detail)
		});

		transactions.set([...$transactions, await response.json()]);
	}

	async function handleDeleteTransaction(event: CustomEvent<TransactionEntity>) {
		const url = `${endpoint}/users/abc/transactions/${event.detail.uuid}`;

		await fetch(url, {
			method: 'DELETE'
		});

		transactions.set($transactions.filter((value) => value.uuid !== event.detail.uuid));
	}
</script>

<div class="layout">
	<TransactionTable {transactions} on:delete={handleDeleteTransaction} />
	<TransactionForm on:create={handleCreateTransaction} />
</div>

<style>
	.layout {
		display: flex;
	}
</style>
