import { expect, test } from "vitest";
import { interpret, Interpreter } from "xstate";
import { waitFor } from "xstate/lib/waitFor";
import createTransactionPageMachine from "../../src/lib/state/transaction-page.machine";

test.skip("start in 'waiting' state", () => {
  const machine = createTransactionPageMachine();
  const service = interpret(machine).start();
  expect(service.state.matches("transactions.waiting")).toBeTruthy();
});

test.skip("updates start when fetching dates", async () => {
  const machine = createTransactionPageMachine();

  const service = interpret(machine).start();
  service.send("FETCH_TRANSACTIONS");
  await waitFor(service, (state) => state.matches("transactions.waiting"));
  console.log(service.state.context);
  expect(service.state.context).toStrictEqual({
    dates: {
      "2022-01-01": expect.any(Interpreter),
      "2022-06-02": expect.any(Interpreter),
    },
  });
});
