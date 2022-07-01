import { assign, createMachine } from "xstate";

export type Context = {
  dates: Record<string, number>;
};

export type Events = FetchTransactionsEvent | FetchTransactionsDoneEvent;

export type FetchTransactionsEvent = {
  type: "FETCH_TRANSACTIONS";
  userId: string;
};
export type FetchTransactionsDoneEvent = {
  type: "done.invoke.fetchingTransactions:invocation[0]";
  data: Record<string, number>;
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
                [key]: value,
              }),
              {}
            ),
        }),
      },
    }
  );
}
