import { expect, it, vi } from "vitest";
import { interpret } from "xstate";
import { createTransactionsFormMachine } from "../../src/lib/state/transactions-form.machine";

const notifySubmit = vi.fn();
const machine = createTransactionsFormMachine({
  transaction: {
    date: "2020-01-01",
    userId: "abc",
  },
}).withConfig({
  actions: {
    notifySubmit,
  },
});

it("starts in 'displaying' state", () => {
  const service = interpret(machine).start();
  expect(service.state.matches("displaying")).toBeTruthy();
});

it("does not submit if transaction is not fully formed", () => {
  const service = interpret(machine).start();
  service.send("SUBMIT");
  expect(notifySubmit).to.not.toHaveBeenCalled();
});

it("submits if transaction is fully formed", () => {
  const machineWithContext = machine.withContext({
    date: "2022-01-01",
    amount: 42,
    name: "McDonalds",
    userId: "abc",
    type: "expenditure",
  });
  const service = interpret(machineWithContext).start();
  service.send("SUBMIT");
  expect(notifySubmit).to.toHaveBeenCalled();
});
