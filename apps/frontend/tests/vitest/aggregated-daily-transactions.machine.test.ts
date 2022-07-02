import { expect, test } from "vitest";
import { interpret, Interpreter } from "xstate";
import createAggregatedDailyTransactionsMachine from "../../src/state/aggregated-daily-transactions.machine";
import waitForState from "./wait-for-state";

test("start in 'waiting' state", () => {
  const machine = createAggregatedDailyTransactionsMachine({
    fetchTransactions: () => Promise.resolve({}),
  });
  const service = interpret(machine).start();
  expect(service.state.matches("waiting")).toBeTruthy();
});

test("updates start when fetching dates", async () => {
  const machine = createAggregatedDailyTransactionsMachine({
    fetchTransactions: () =>
      Promise.resolve({
        "2022-01-01": 42,
        "2022-06-02": 53,
      }),
  });

  const service = interpret(machine).start();
  service.send("FETCH_TRANSACTIONS");
  await waitForState(service, "waiting");
  expect(service.state.context).toStrictEqual({
    dates: {
      "2022-01-01": expect.any(Interpreter),
      "2022-06-02": expect.any(Interpreter),
    },
  });
});
