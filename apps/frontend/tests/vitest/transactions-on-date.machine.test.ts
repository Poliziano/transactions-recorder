import { expect, it } from "vitest";
import { interpret, Interpreter } from "xstate";
import { waitFor } from "xstate/lib/waitFor";
import { createTransactionsOnDateMachine } from "../../src/lib/state/transactions-on-date.machine";

const machine = createTransactionsOnDateMachine({
  date: "2022-01-01",
  total: 0,
}).withConfig({
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

it("initialises to 'hidingTransactions' state", () => {
  const service = interpret(machine).start();
  expect(service.state.matches("hidingTransactions")).toBeTruthy();
});

it("fetches transactions", async () => {
  const service = interpret(machine).start();
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

it("adds new transactions", async () => {
  const service = interpret(machine).start();
  service.send({
    type: "APPEND_TRANSACTION",
    data: {
      userId: "abc",
      name: "McDonalds",
      amount: 6.99,
      type: "expenditure",
      date: "2022-01-01",
      uuid: "uuid_3",
    },
  });

  expect(service.state.context).toEqual({
    date: "2022-01-01",
    total: 6.99,
    transactions: {
      uuid_3: expect.any(Interpreter),
    },
  });
});

it("removes transactions", async () => {
  const service = interpret(machine).start();
  service.send("FETCH_TRANSACTIONS");
  await waitFor(service, (state) => state.matches("displayingTransactions"));
  service.send({
    type: "REMOVE_TRANSACTION",
    data: "uuid_2",
  });

  expect(service.state.context).toEqual({
    date: "2022-01-01",
    total: 15,
    transactions: {
      uuid_1: expect.any(Interpreter),
    },
  });
});
