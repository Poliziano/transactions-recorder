import { expect, test } from "vitest";
import { interpret } from "xstate";
import { waitFor } from "xstate/lib/waitFor";
import createTransactionDateMachine, {
  Context,
} from "../../src/lib/state/transaction-date.machine";

test("start in 'closed' state", () => {
  const machine = createTransactionDateMachine({
    date: "2022-01-01",
    total: 0,
    fetchTransactions: () => Promise.resolve([]),
  });
  const service = interpret(machine).start();
  expect(service.state.matches("closed")).toBeTruthy();
});

test("updates start when fetching transactions", async () => {
  const machine = createTransactionDateMachine({
    date: "2022-01-01",
    total: 100,
    fetchTransactions: () =>
      Promise.resolve([
        {
          userId: "abc",
          name: "Starbucks",
          amount: 24,
          type: "expenditure",
          date: "2022-01-01",
          uuid: "transactions_uuid",
        },
      ]),
  });

  const service = interpret(machine).start();
  service.send("FETCH_TRANSACTIONS");
  await waitFor(service, (state) => state.matches("displayingTransactions"));
  expect(service.state.context).toStrictEqual<Context>({
    date: "2022-01-01",
    total: 100,
    transactions: [
      {
        userId: "abc",
        name: "Starbucks",
        amount: 24,
        type: "expenditure",
        date: "2022-01-01",
        uuid: "transactions_uuid",
      },
    ],
  });
});
