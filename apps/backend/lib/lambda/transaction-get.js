const { listTransactions } = require("../data/transactions");

exports.handler = async function(event) {
  console.log("event", JSON.stringify(event, null, 2));

  const transactions = await listTransactions({ userId: event.pathParameters.userId });

  return {
    statusCode: 200,
    body: JSON.stringify({
      transactions: transactions
    })
  }
};