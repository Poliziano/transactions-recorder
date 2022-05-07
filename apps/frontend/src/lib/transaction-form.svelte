<script lang="ts">
	import type { TransactionEntity } from 'src/api/transaction';

	async function handleSubmit(event: SubmitEvent) {
		const formData = new FormData(event.target as HTMLFormElement);
		const transaction: Pick<TransactionEntity, 'name' | 'amount' | 'date' | 'type'> = {
			name: formData.get('name') as string,
			amount: +(formData.get('amount') as string),
			date: new Date(formData.get('date') as string).toISOString(),
			type: formData.get('type') as 'income' | 'expenditure'
		};

		const url =
			'https://w3nezq09u5.execute-api.eu-west-2.amazonaws.com/prod/users/abc/transactions';
		await fetch(url, {
			method: 'POST',
			body: JSON.stringify(transaction)
		});
	}
</script>

<form class="new-transaction-form" on:submit|preventDefault={handleSubmit}>
	<input name="name" type="text" placeholder="Name" required />
	<input name="amount" type="number" placeholder="Amount" required />
	<input name="date" type="date" value={new Date().toISOString().split('T')[0]} required />
	<select name="type" required>
		<option value="expenditure" default>Expenditure</option>
		<option value="income">Income</option>
	</select>
	<input type="submit" placeholder="Submit" />
</form>

<style>
	.new-transaction-form {
		display: flex;
		flex-direction: column;
		width: 350px;
		padding: 10px;
	}
</style>
