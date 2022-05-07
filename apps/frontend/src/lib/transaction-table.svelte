<script lang="ts">
	import type { TransactionEntity } from 'src/api/transaction';
	import Transaction from './transaction.svelte';

	export let transactions: TransactionEntity[] = [];

	$: transactionsByDate = transactions.reduce<Record<string, TransactionEntity[]>>(function (
		previousValue,
		currentValue
	) {
		const groupedTransactions = previousValue[currentValue.date] ?? [];
		previousValue[currentValue.date] = [...groupedTransactions, currentValue];
		return previousValue;
	},
	{});
</script>

{#each Object.entries(transactionsByDate) as record}
	<h2>{new Date(record[0]).toLocaleDateString()}</h2>
	<div class="transactions">
		{#each record[1] as transaction}
			<Transaction {transaction} />
		{/each}
	</div>
{/each}

<style>
	.transactions {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		border-radius: 20px;
		gap: 5px;
	}
</style>
