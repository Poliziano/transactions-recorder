import { expect, test } from "vitest";
import { interpret, Interpreter } from "xstate";
import { waitFor } from "xstate/lib/waitFor";
import { createTransactionsOnDateMachine } from "../../src/lib/state/transactions-on-date-machine";

const machine = createTransactionsOnDateMachine({
  date: "2022-01-01",
  total: 25,
});

test("initialises to 'hidingTransactions' state", () => {
  const service = interpret(machine).start();
  expect(service.state.matches("hidingTransactions")).toBeTruthy();
});

test("fetches transactions", async () => {
  const machineWithMockFetch = machine.withConfig({
    services: {
      fetch: () =>
        Promise.resolve([
          {
            userId: "abc",
            name: "McDonalds",
            amount: 15,
            type: "expenditure",
            date: "2022-01-01",
            uuid: "uuid_1",
          },
          {
            userId: "abc",
            name: "KFC",
            amount: 10,
            type: "expenditure",
            date: "2022-01-01",
            uuid: "uuid_2",
          },
        ]),
    },
  });

  const service = interpret(machineWithMockFetch).start();
  service.send("FETCH_TRANSACTIONS");
  await waitFor(service, (state) => state.matches("displayingTransactions"));

  expect(service.state.context).toEqual({
    date: "2022-01-01",
    total: 25,
    transactions: {
      uuid_1: expect.any(Interpreter),
      uuid_2: expect.any(Interpreter),
    },
  });
});
