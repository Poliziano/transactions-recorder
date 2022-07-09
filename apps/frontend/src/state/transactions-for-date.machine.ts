import type { TransactionFormParams } from "$lib/transaction-form";
import type { TransactionEntity } from "src/api/transaction";
import { assign, createMachine, sendParent } from "xstate";

export type Context = {
  date: string;
  total: number;
  transactions: TransactionEntity[];
};

export type Events =
  | FetchTransactionsEvent
  | FetchTransactionsDoneEvent
  | CloseTransactionsEvent
  | OpenTransactionFormEvent
  | TransactionCreatedEvent;

export type FetchTransactionsEvent = {
  type: "FETCH_TRANSACTIONS";
};

export type FetchTransactionsDoneEvent = {
  type: "done.invoke.fetchingTransactions:invocation[0]";
  data: TransactionEntity[];
};

export type CloseTransactionsEvent = {
  type: "CLOSE_TRANSACTIONS";
};

export type OpenTransactionFormEvent = {
  type: "OPEN_TRANSACTION_FORM";
  data: TransactionFormParams;
};

export type TransactionCreatedEvent = {
  type: "TRANSACTION_CREATED";
  data: TransactionEntity;
};

export type CreateTransactionsForDateMachineParams = {
  date: Context["date"];
  total: Context["total"];
  fetchTransactions: (
    context: Context,
    event: FetchTransactionsEvent
  ) => Promise<FetchTransactionsDoneEvent["data"]>;
};

export default function createTransactionsForDateMachine({
  date,
  total,
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
        total,
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
        displayingTransactions: {
          on: {
            CLOSE_TRANSACTIONS: "closed",
          },
        },
      },
      on: {
        OPEN_TRANSACTION_FORM: {
          actions: "sendOpenTransactionForm",
        },
        TRANSACTION_CREATED: {
          actions: ["appendTransaction"],
        },
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
        sendOpenTransactionForm: sendParent((_, event) => event),
        appendTransaction: assign({
          transactions: (context, event) => [
            ...context.transactions,
            event.data,
          ],
          total: (context, event) => context.total + event.data.amount,
        }),
      },
    }
  );
}
