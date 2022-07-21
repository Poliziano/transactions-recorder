import { expect, test, vi } from "vitest";
import { interpret } from "xstate";
import { waitFor } from "xstate/lib/waitFor";
import { createTransactionMachine } from "../../src/lib/state/transaction.machine";

const machine = createTransactionMachine({
  transaction: {
    userId: "user_id",
    name: "McDonalds",
    amount: 24.99,
    type: "expenditure",
    date: "2022-01-01",
    uuid: "uuid",
  },
});

test("initialises to 'active' state", () => {
  const service = interpret(machine).start();
  expect(service.state.matches("active")).toBeTruthy();
});

test("toggle options menu", () => {
  const service = interpret(machine).start();
  expect(service.state.context.optionsOpen).toBeFalsy();

  service.send("OPEN_OPTIONS");
  expect(service.state.context.optionsOpen).toBeTruthy();

  service.send("CLOSE_OPTIONS");
  expect(service.state.context.optionsOpen).toBeFalsy();
});

test("deletes transaction", async () => {
  const machineWithMockDelete = machine.withConfig({
    services: {
      delete: () => Promise.resolve(),
    },
    actions: {
      notifyParent: vi.fn(),
    },
  });
  const service = interpret(machineWithMockDelete).start();

  service.send("DELETE");
  expect(service.state.matches("deleting")).toBeTruthy();

  await waitFor(service, (state) => state.matches("deleted"));
  expect(service.state.matches("deleted")).toBeTruthy();
});
