import type { TransactionFormParams } from "$lib/transaction-form";
import { assign, createMachine, spawn, type ActorRefFrom } from "xstate";
import createTransactionsForDateMachine from "./transactions-for-date.machine";
import { fetchTransactionsForDate } from "./transactions.service";

export type Context = {
  dates: Record<
    string,
    ActorRefFrom<ReturnType<typeof createTransactionsForDateMachine>>
  >;
};

export type Events =
  | FetchTransactionsEvent
  | FetchTransactionsDoneEvent
  | OpenTransactionFormEvent;

export type FetchTransactionsEvent = {
  type: "FETCH_TRANSACTIONS";
  userId: string;
};
export type FetchTransactionsDoneEvent = {
  type: "done.invoke.fetchingTransactions:invocation[0]";
  data: Record<string, number>;
};

export type OpenTransactionFormEvent = {
  type: "OPEN_TRANSACTION_FORM";
  data: TransactionFormParams;
};

export type CreateAggregatedDailyTransactionsMachineParams = {
  fetchTransactions: (
    context: Context,
    event: FetchTransactionsEvent
  ) => Promise<FetchTransactionsDoneEvent["data"]>;
};

export default function createAggregatedDailyTransactionsMachine({
  fetchTransactions,
}: CreateAggregatedDailyTransactionsMachineParams) {
  return createMachine(
    {
      tsTypes:
        {} as import("./aggregated-daily-transactions.machine.typegen").Typegen0,
      schema: {
        context: {} as Context,
        events: {} as Events,
      },
      initial: "waiting",
      context: {
        dates: {},
      },
      states: {
        waiting: {
          on: {
            FETCH_TRANSACTIONS: "fetchingTransactions",
          },
        },
        fetchingTransactions: {
          id: "fetchingTransactions",
          invoke: {
            src: "fetchTransactions",
            onDone: {
              target: "waiting",
              actions: ["assignTransactions"],
            },
          },
        },
      },
      on: {
        OPEN_TRANSACTION_FORM: {
          actions: (_, event) => console.log(JSON.stringify(event)),
        },
      },
    },
    {
      services: {
        fetchTransactions,
      },
      actions: {
        assignTransactions: assign({
          dates: (_, event) =>
            Object.entries(event.data).reduce(
              (previous, [key, value]) => ({
                ...previous,
                [key]: spawn(
                  createTransactionsForDateMachine({
                    date: key,
                    total: value,
                    fetchTransactions(context, event) {
                      return fetchTransactionsForDate(key);
                    },
                  })
                ),
              }),
              {}
            ),
        }),
      },
    }
  );
}
