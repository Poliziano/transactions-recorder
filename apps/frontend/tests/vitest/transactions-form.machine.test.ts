import { expect, it, vi } from "vitest";
import { interpret } from "xstate";
import { createTransactionsFormMachine } from "../../src/lib/state/transactions-form.machine";

const machine = createTransactionsFormMachine({
  transaction: {
    date: "2020-01-01",
  },
});

it("starts in 'displaying' state", () => {
  const service = interpret(machine).start();
  expect(service.state.matches("displaying")).toBeTruthy();
});

it("does not submit if transaction is not fully formed", () => {
  const notifySubmitMock = vi.fn();
  const mockedMachine = machine.withConfig({
    actions: {
      notifySubmit: notifySubmitMock,
    },
  });
  const service = interpret(mockedMachine).start();
  service.send("SUBMIT");
  expect(notifySubmitMock).to.not.toHaveBeenCalled();
});

it("does not submit if transaction is not fully formed", () => {
  const notifySubmitMock = vi.fn();
  const mockedMachine = machine
    .withContext({
      date: "2022-01-01",
      amount: 42,
      name: "McDonalds",
      userId: "abc",
      type: "expenditure",
    })
    .withConfig({
      actions: {
        notifySubmit: notifySubmitMock,
      },
    });
  const service = interpret(mockedMachine).start();
  service.send("SUBMIT");
  expect(notifySubmitMock).to.toHaveBeenCalled();
});
