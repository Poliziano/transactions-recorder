<script lang="ts">
	import type { TransactionEntity } from 'src/api/transaction';
	import { createEventDispatcher } from 'svelte';

	export let transaction: TransactionEntity;
	const dispatch = createEventDispatcher<{ delete: TransactionEntity }>();
	let hover = false;

	function deleteClicked() {
		dispatch('delete', transaction);
	}
</script>

<div class="card" on:mouseenter={() => (hover = true)} on:mouseleave={() => (hover = false)}>
	<div class="header">
		<div>{transaction.name}</div>
		<div class:income-highlight={transaction.type === 'income'}>
			{transaction.type === 'income' ? '+' : ''}£{transaction.amount}
		</div>
	</div>
	<button on:click={deleteClicked} style:visibility={hover ? '' : 'hidden'}>X</button>
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
