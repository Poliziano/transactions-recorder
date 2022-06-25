import { putTransaction } from "../../../lib/data/transactions/create-transaction";
import { listTransactions } from "../../../lib/data/transactions/list-transactions";
import randomUserId from "../../factories/user-id";

const userId = randomUserId();

test.func(listTransactions, [
  {
    name: "return empty list of transactions",
    input: [{ userId }],
    expectedOutput: [],
  },
  {
    name: "return list of transactions",
    input: [{ userId }],
    expectedOutput: [
      {
        userId,
        uuid: "transaction_uuid_1",
        date: new Date(2021, 1, 1),
        name: "Tesco",
        amount: 12.5,
        type: "expenditure",
      },
      {
        userId,
        uuid: "transaction_uuid_2",
        date: new Date(2020, 1, 1),
        name: "Sainsburys",
        amount: 7.99,
        type: "expenditure",
      },
    ],
    async setup() {
      await putTransaction({
        userId,
        uuid: "transaction_uuid_1",
        date: new Date(2021, 1, 1),
        name: "Tesco",
        amount: 12.5,
        type: "expenditure",
      });
      await putTransaction({
        userId,
        uuid: "transaction_uuid_2",
        date: new Date(2020, 1, 1),
        name: "Sainsburys",
        amount: 7.99,
        type: "expenditure",
      });
    },
  },
]);
