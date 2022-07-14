import type {
  TransactionEntity,
  TransactionEntityCreateParams,
} from "$lib/api/transaction";
import type { TransactionFormParams } from "$lib/transaction-form";
import { assign, createMachine, send, spawn, type ActorRefFrom } from "xstate";
import { createTransactionsOnDateMachine } from "./transactions-on-date.machine";
import {
  createTransaction,
  fetchTransactionsDailySum,
} from "./transactions.service";

/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPbYC0ADujAHRpY77HbUDu6BhmUAxAGICiAFQDCACQD6ggEoBBAHIBlGcMEBJAPKLEockVgcm2kAA9EAJgCMAVmpmA7AGYALGYBsADjNPXTgJxP3ABoQAE9zK3dqV2iPKysnC18vAAYnAF804LpsPEISWAoqMFoMHMZ86gAzMGRcAAsCLkFShjzsbggSYsaANyIAa2Lq2oamltymeCQQXX02o1MESxt7ZzdPbz8A4LCECzsLKJjXMwdnH2TnDKzx8rJKGkqiVABbalwAGz1IbnUABX4ckkskUyjUmgU4l46ikAFkjLMDCQFuYzGZqN5kr4HK4LMk7FYTr5XDtEK4HDZfFSqU4nA5kmYrBZ3NcQNlWpNCo9nm8iOQwJgfsIADLqBT8YHyJQqDRA6FwhF6JGYFFLU7UYnuA5nBxeXwWaKkhARSLJM2pHFmYnYhys9kTfJcoY86h8gU-BQAVQAQrDVIJJaCZZooTD4dNEfNpotHCtHAlfO4TpsnEbcU5qAbolY7K5scyKXbbm0Cg9na9qLAAK4AIxeHE4PE6guovQGxWrdYbjSgzXoDpVEaVUdAMacNiZhOSPmc+wcRpcNmOFgs9iTBosGUyIEwRAgcCM9rupaKJX7x9Y7EbirmhmjiDsZiNiXRVnN1hOJwcuZZ26PJadM8yhLKoanqHs+2AyYb2VVVvHROxNUcCw6QSRxnzsZJqHNM07HcXxUlzJw7CLc8ALLICOXyGCRxMRBtlCRBfDsbDzV1Xx4jWbFSKgx0KKeCtPm+CAaLvUcHyfRiEFxFY-ETJMzHcOksR4qj7lPATeX5QURKHW9kXvBAAgzFDkisbE6XcLEEnnKTCQzY40XcTxGV-G4yM5fiXU7etkGvPTYMMvFkkOJJmRQ6I8S-I04iw9wdTNKk8KZMxVIHE9uVeUSDPEoygikil0WOHE1gCRkrDS48nWywdcq8I0vFYnDmvNEityAA */
const machine = createMachine(
  {
    tsTypes: {} as import("./transaction-page.machine.typegen").Typegen0,
    schema: {
      context: {} as {
        dates: Record<
          string,
          ActorRefFrom<ReturnType<typeof createTransactionsOnDateMachine>>
        >;
        form?: TransactionFormParams;
      },
      events: {} as
        | {
            type: "FETCH_TRANSACTIONS";
            userId: string;
          }
        | {
            type: "done.invoke.fetchingTransactions";
            data: Record<string, number>;
          }
        | {
            type: "OPEN_TRANSACTIONS_FORM";
            data: TransactionFormParams;
          }
        | {
            type: "CLOSE_TRANSACTION_FORM";
          }
        | {
            type: "SUBMIT_TRANSACTION_FORM";
            data: TransactionEntityCreateParams;
          }
        | {
            type: "done.invoke.submittingTransaction";
            data: TransactionEntity;
          },
    },
    id: "transactions-page",
    type: "parallel",
    states: {
      transactions: {
        initial: "waiting",
        states: {
          waiting: {
            on: {
              FETCH_TRANSACTIONS: {
                target: "fetchingTransactions",
              },
            },
          },
          fetchingTransactions: {
            invoke: {
              src: "fetchTransactions",
              id: "fetchingTransactions",
              onDone: [
                {
                  actions: "assignTransactions",
                  target: "waiting",
                },
              ],
            },
          },
        },
      },
      form: {
        initial: "closed",
        states: {
          closed: {
            on: {
              OPEN_TRANSACTIONS_FORM: {
                target: "opened",
              },
            },
          },
          opened: {
            entry: "assignFormFields",
            exit: "removeFormFields",
            on: {
              CLOSE_TRANSACTION_FORM: {
                target: "closed",
              },
              SUBMIT_TRANSACTION_FORM: {
                target: "submitting",
              },
            },
          },
          submitting: {
            invoke: {
              src: "createTransaction",
              id: "submittingTransaction",
              onDone: [
                {
                  actions: "sendTransactionUpdatedEvent",
                  target: "closed",
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    services: {
      fetchTransactions: fetchTransactionsDailySum,
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
          to: (context, event) => context.dates[event.data.date.split("T")[0]],
        }
      ),
    },
  }
);

export default function createTransactionPageMachine() {
  return machine.withContext({ dates: {} });
}
