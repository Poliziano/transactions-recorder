import { putTransaction } from "../../../lib/data/transactions/create-transaction";
import { deleteTransaction } from "../../../lib/data/transactions/delete-transaction";
import { listTransactions } from "../../../lib/data/transactions/list-transactions";
import randomUserId from "../../factories/user-id";

const userId = randomUserId();

test("should delete transaction", async () => {
  await putTransaction({
    userId,
    uuid: "transaction_uuid",
    date: new Date(2021, 1, 1),
    name: "McDonalds",
    amount: 12.5,
    type: "expenditure",
  });
  await deleteTransaction({
    userId,
    transactionId: "transaction_uuid",
  });

  const transactions = await listTransactions({ userId });
  expect(transactions).toStrictEqual([]);
});

test("throw exception when attempting to delete non-existent transaction", async () => {
  await expect(
    deleteTransaction({ userId, transactionId: "non_existent_transaction" })
  ).rejects.toThrowError();
});
