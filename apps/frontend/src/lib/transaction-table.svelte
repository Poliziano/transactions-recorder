<script lang="ts">
	import type { TransactionEntity } from 'src/api/transaction';
	import { readable, type Readable } from 'svelte/store';
	import Transaction from './transaction.svelte';

	export let transactions: Readable<TransactionEntity[]> = readable([]);
	$: transactionsByDate = $transactions.reduce(function (previousValue, currentValue) {
		const groupedTransactions = previousValue[currentValue.date] ?? [];
		previousValue[currentValue.date] = [...groupedTransactions, currentValue];
		return previousValue;
	}, {} as Record<string, TransactionEntity[]>);
</script>

<div class="container">
	{#each Object.entries(transactionsByDate) as record}
		<h2>{new Date(record[0]).toLocaleDateString()}</h2>
		<div class="transactions">
			{#each record[1] as transaction}
				<Transaction on:delete {transaction} />
			{/each}
		</div>
	{/each}
</div>

<style>
	.container {
		width: 100%;
	}
	.transactions {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		border-radius: 20px;
		gap: 5px;
	}
</style>
