import type {
  TransactionEntity,
  TransactionEntityCreateParams,
} from "$lib/api/transaction";
import type { TransactionFormParams } from "$lib/transaction-form";
import { assign, createMachine, send, spawn, type ActorRefFrom } from "xstate";
import { createTransactionsOnDateMachine } from "./transactions-on-date.machine";

export type Context = {
  dates: Record<
    string,
    ActorRefFrom<ReturnType<typeof createTransactionsOnDateMachine>>
  >;
  form?: TransactionFormParams;
};

export type Events =
  | FetchTransactionsEvent
  | FetchTransactionsDoneEvent
  | OpenTransactionFormEvent
  | CloseTransactionFormEvent
  | SubmitTransactionFormEvent
  | SubmitTransactionFormDoneEvent;

export type FetchTransactionsEvent = {
  type: "FETCH_TRANSACTIONS";
  userId: string;
};

export type FetchTransactionsDoneEvent = {
  type: "done.invoke.fetchingTransactions:invocation[0]";
  data: Record<string, number>;
};

export type OpenTransactionFormEvent = {
  type: "OPEN_TRANSACTIONS_FORM";
  data: TransactionFormParams;
};

export type CloseTransactionFormEvent = {
  type: "CLOSE_TRANSACTION_FORM";
};

export type SubmitTransactionFormEvent = {
  type: "SUBMIT_TRANSACTION_FORM";
  data: TransactionEntityCreateParams;
};

export type SubmitTransactionFormDoneEvent = {
  type: "done.invoke.submittingTransaction:invocation[0]";
  data: TransactionEntity;
};

export type CreateAggregatedDailyTransactionsMachineParams = {
  fetchTransactions: (
    context: Context,
    event: FetchTransactionsEvent
  ) => Promise<FetchTransactionsDoneEvent["data"]>;

  createTransaction: (
    context: Context,
    event: SubmitTransactionFormEvent
  ) => Promise<SubmitTransactionFormDoneEvent["data"]>;
};

export default function createTransactionPageMachine({
  fetchTransactions,
  createTransaction,
}: CreateAggregatedDailyTransactionsMachineParams) {
  return createMachine(
    {
      tsTypes: {} as import("./transaction-page.machine.typegen").Typegen0,
      schema: {
        context: {} as Context,
        events: {} as Events,
      },
      context: {
        dates: {},
      },
      type: "parallel",
      states: {
        transactions: {
          initial: "waiting",
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
        form: {
          initial: "closed",
          states: {
            closed: {
              on: {
                OPEN_TRANSACTIONS_FORM: "opened",
              },
            },
            opened: {
              entry: "assignFormFields",
              exit: "removeFormFields",
              on: {
                CLOSE_TRANSACTION_FORM: "closed",
                SUBMIT_TRANSACTION_FORM: "submitting",
              },
            },
            submitting: {
              id: "submittingTransaction",
              invoke: {
                src: "createTransaction",
                onDone: {
                  target: "closed",
                  actions: ["sendTransactionUpdatedEvent"],
                },
              },
            },
          },
        },
      },
    },
    {
      services: {
        fetchTransactions,
        createTransaction,
      },
      actions: {
        assignTransactions: assign({
          dates: (_, event) =>
            Object.entries(event.data).reduce(
              (previous, [key, value]) => ({
                ...previous,
                [key]: spawn(
                  createTransactionsOnDateMachine({
                    date: key,
                    total: value,
                  })
                ),
              }),
              {}
            ),
        }),
        assignFormFields: assign({
          form: (_, event) => event.data,
        }),
        removeFormFields: assign({
          form: (_context, _event) => undefined,
        }),
        sendTransactionUpdatedEvent: send(
          (_, event) => ({
            type: "APPEND_TRANSACTION",
            data: event.data,
          }),
          {
            to: (context, event) =>
              context.dates[event.data.date.split("T")[0]],
          }
        ),
      },
    }
  );
}
