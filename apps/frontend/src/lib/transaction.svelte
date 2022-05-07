<script lang="ts">
	import type { TransactionEntity } from 'src/api/transaction';
	export let transaction: TransactionEntity;
</script>

<div class="card">
	<div class="header">
		<div>{transaction.name}</div>
		<div class:income-highlight={transaction.type === 'income'}>
			{transaction.type === 'income' ? '+' : ''}£{transaction.amount}
		</div>
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 10px;
		width: 250px;
		padding: 10px;
		background-color: white;
		border-radius: 8px;
	}
	.header {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	.income-highlight {
		font-weight: 600;
	}
</style>
