const { listTransactions } = require("../data/transactions");

exports.handler = async function() {
  const transactions = await listTransactions({ userId: "abc" });

  return {
    statusCode: 200,
    body: JSON.stringify({
      transactions: transactions
    })
  }
};