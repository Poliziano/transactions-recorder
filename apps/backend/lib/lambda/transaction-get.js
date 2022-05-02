const { listTransactions } = require("../data/transactions");

exports.handler = async function() {
  try {
    const transactions = await listTransactions({ userId: "abc" });

    return {
      statusCode: 200,
      body: JSON.stringify({
        transactions: transactions
      })
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An exception occurred",
        error: err
      })
    }
  }
};