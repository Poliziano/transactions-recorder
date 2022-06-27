import type { TransactionEntity } from "src/api/transaction";
import { assign, createMachine } from "xstate";

export type Context = {
  date: string;
  transactions: TransactionEntity[];
};

export type Events = FetchTransactionsEvent | FetchTransactionsDoneEvent;

export type FetchTransactionsEvent = {
  type: "FETCH_TRANSACTIONS";
};

export type FetchTransactionsDoneEvent = {
  type: "done.invoke.fetchingTransactions:invocation[0]";
  data: TransactionEntity[];
};

export type CreateTransactionsForDateMachineParams = {
  date: Context["date"];
  fetchTransactions: (
    context: Context,
    event: FetchTransactionsEvent
  ) => Promise<FetchTransactionsDoneEvent["data"]>;
};

export default function createTransactionsForDateMachine({
  date,
  fetchTransactions,
}: CreateTransactionsForDateMachineParams) {
  return createMachine(
    {
      tsTypes: {} as import("./transactions-for-date.machine.typegen").Typegen0,
      schema: {
        context: {} as Context,
        events: {} as Events,
      },
      initial: "closed",
      context: {
        date,
        transactions: [],
      },
      states: {
        closed: {
          on: {
            FETCH_TRANSACTIONS: "fetchingTransactions",
          },
        },
        fetchingTransactions: {
          id: "fetchingTransactions",
          invoke: {
            src: "fetchTransactions",
            onDone: {
              target: "displayingTransactions",
              actions: ["assignTransactions"],
            },
          },
        },
        displayingTransactions: {},
      },
    },
    {
      services: {
        fetchTransactions,
      },
      actions: {
        assignTransactions: assign({
          transactions: (_, event) => event.data,
        }),
      },
    }
  );
}
