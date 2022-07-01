import { test, expect } from "vitest";
import { interpret } from "xstate";
import createTransactionsForDateMachine from "../../src/state/transactions-for-date.machine";
import waitForState from "./wait-for-state";

test("start in 'closed' state", () => {
  const machine = createTransactionsForDateMachine({
    date: "2022-01-01",
    fetchTransactions: () => Promise.resolve([]),
  });
  const service = interpret(machine).start();
  expect(service.state.matches("closed")).toBeTruthy();
});

test("updates start when fetching transactions", async () => {
  const machine = createTransactionsForDateMachine({
    date: "2022-01-01",
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
  await waitForState(service, "displayingTransactions");
  expect(service.state.context).toMatchObject({
    date: "2022-01-01",
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
