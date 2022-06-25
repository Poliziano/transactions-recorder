import { listTransactionsForDate } from "../../../lib/data/transactions/list-transactions-for-date";
import { batchPutTransactions } from "../../factories/transactions";
import randomUserId from "../../factories/user-id";

const userId = randomUserId();

test.func(listTransactionsForDate, [
  {
    name: "return list of transactions on date",
    input: [{ userId, date: "2021-02-01" }],
    expectedOutput: [
      {
        userId,
        uuid: "transaction_uuid_1",
        date: new Date(2021, 1, 1),
        name: "KFC",
        amount: 12.5,
        type: "expenditure",
      },
    ],
    setup() {
      return batchPutTransactions([
        {
          userId,
          uuid: "transaction_uuid_1",
          date: new Date(2021, 1, 1),
          name: "KFC",
          amount: 12.5,
          type: "expenditure",
        },
        {
          userId,
          uuid: "transaction_uuid_2",
          date: new Date(2020, 1, 1),
          name: "Arc Cinema",
          amount: 7.99,
          type: "expenditure",
        },
      ]);
    },
  },
]);
