<script lang="ts">
	let result = 'pending';

	(async function () {
		const url =
			'https://w3nezq09u5.execute-api.eu-west-2.amazonaws.com/prod/users/abc/transactions';
		const response = await fetch(url, {
			method: 'GET'
		});

		if (response.ok) {
			const transactions = await response.json();
			result = JSON.stringify(transactions, null, 2);
		} else {
			result = 'Failed to get';
		}
	})();
</script>

<p>{result}</p>
