import type { TransactionFormParams } from "$lib/transaction-form";
import { assign, createMachine, spawn, type ActorRefFrom } from "xstate";
import createAggregatedDailyTransactionsMachine from "./aggregated-daily-transactions.machine";
import { fetchTransactionsDailySum } from "./transactions.service";

export type Context = {
  table: ActorRefFrom<
    ReturnType<typeof createAggregatedDailyTransactionsMachine>
  >;
};

export type Events = OpenTransactionFormEvent;

export type OpenTransactionFormEvent = {
  type: "OPEN_TRANSACTION_FORM";
  data: TransactionFormParams;
};

export default function createTransactionPageMachine() {
  return createMachine(
    {
      tsTypes: {} as import("./transactions-page.machine.typegen").Typegen0,
      schema: {
        context: {} as Context,
        events: {} as Events,
      },
      initial: "running",
      entry: "initialise",
      states: {
        running: {},
      },
      on: {
        OPEN_TRANSACTION_FORM: {
          actions: (_, event) => console.log(JSON.stringify(event)),
        },
      },
    },
    {
      actions: {
        initialise: assign({
          table: () =>
            spawn(
              createAggregatedDailyTransactionsMachine({
                fetchTransactions: fetchTransactionsDailySum,
              })
            ),
        }),
      },
    }
  );
}
