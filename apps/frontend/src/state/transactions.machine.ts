import { assign, createMachine } from "xstate";
import type {
  TransactionEntity,
  TransactionEntityCreateParams,
} from "../api/transaction";

export type Context = {
  transactions: TransactionEntity[];
};

export type Events =
  | FetchTransactionsEvent
  | FetchTransactionsDoneEvent
  | CreateTransactionEvent
  | CreateTransactionDoneEvent
  | DeleteTransactionEvent
  | DeleteTransactionDoneEvent;

export type FetchTransactionsEvent = {
  type: "FETCH_TRANSACTIONS";
  userId: string;
};
export type FetchTransactionsDoneEvent = {
  type: "done.invoke.fetchingTransactions:invocation[0]";
  data: TransactionEntity[];
};
export type CreateTransactionEvent = {
  type: "CREATE_TRANSACTION";
  data: TransactionEntityCreateParams;
};
export type CreateTransactionDoneEvent = {
  type: "done.invoke.creatingTransaction:invocation[0]";
  data: TransactionEntity;
};
export type DeleteTransactionEvent = {
  type: "DELETE_TRANSACTION";
  data: TransactionEntity;
};
export type DeleteTransactionDoneEvent = {
  type: "done.invoke.deletingTransaction:invocation[0]";
  data: TransactionEntity;
};

export type CreateTransactionsMachineParams = {
  fetchTransactions: (
    context: Context,
    event: FetchTransactionsEvent
  ) => Promise<TransactionEntity[]>;

  createTransaction: (
    context: Context,
    event: CreateTransactionEvent
  ) => Promise<TransactionEntity>;

  deleteTransaction: (
    context: Context,
    event: DeleteTransactionEvent
  ) => Promise<TransactionEntity>;
};

export function createTransactionsMachine({
  fetchTransactions,
  createTransaction,
  deleteTransaction,
}: CreateTransactionsMachineParams) {
  return createMachine(
    {
      context: {
        transactions: [],
      },
      tsTypes: {} as import("./transactions.machine.typegen").Typegen0,
      schema: {
        context: {} as Context,
        events: {} as Events,
      },
      initial: "waiting",
      states: {
        waiting: {
          on: {
            FETCH_TRANSACTIONS: "fetchingTransactions",
            CREATE_TRANSACTION: "creatingTransaction",
            DELETE_TRANSACTION: "deletingTransaction",
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
        creatingTransaction: {
          id: "creatingTransaction",
          invoke: {
            src: "createTransaction",
            onDone: {
              target: "waiting",
              actions: ["appendTransaction"],
            },
          },
        },
        deletingTransaction: {
          id: "deletingTransaction",
          invoke: {
            src: "deleteTransaction",
            onDone: {
              target: "waiting",
              actions: ["removeTransaction"],
            },
          },
        },
      },
    },
    {
      services: {
        fetchTransactions,
        createTransaction,
        deleteTransaction,
      },
      actions: {
        assignTransactions: assign({
          transactions: (_, event) => event.data,
        }),
        appendTransaction: assign({
          transactions: (context, event) => [
            event.data,
            ...context.transactions,
          ],
        }),
        removeTransaction: assign({
          transactions: (context, event) =>
            context.transactions.filter(
              (value) => value.uuid !== event.data.uuid
            ),
        }),
      },
    }
  );
}
