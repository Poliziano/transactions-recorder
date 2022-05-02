const { createTransaction } = require("../data/transactions");
const { TransactionEntity } = require("../entity/transaction-entity");

exports.handler = async function(event) {
  const payload = JSON.parse(event.body);
  const entity = new TransactionEntity({
    userId: "abc",
    date: new Date(2021, 1, 1),
    name: "McDonalds",
    amount: 12.50,
    type: "expenditure",
  });
  
  await createTransaction(entity);

  return {
    statusCode: 200,
    body: ""
  }
};