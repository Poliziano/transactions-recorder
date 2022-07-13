import type { TransactionEntity } from "$lib/api/transaction";
import { assign, createMachine, spawn } from "xstate";
import { createTransactionMachine } from "./transaction-machine";
import { fetchTransactionsForDate } from "./transactions.service";

/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPbYC0JpE6yYAdABYEQGZQAqG2ehJsAxADEAomwDCACQD6bAEoBBAHIBlOaLYBJAPLLEoAA5FYBHpl0gAHogBMAdgAMtAMwBWAJyObrgCx2AjM5sPRwAaEABPRGdbWi9XOJc3O0c7LwBfVNC0LBx8YjIKKhpaADMwZFxGVg5s7jz+CBI6FgA3IgBrOlLy+mquXN4zAyMTM0sET1daZ0dfKwAORy9nX1cANjs50IiEZzsbWjj41ZtVnwD0zM4ck1hyTEpqOmZYPQAbdDCWdiva3j5RAAymiUQmk8mUqg02iUg0Mxjyo0QcxSBysa1Wq1cbkcVisqy2iBcqwOhzmXnJNkp8wuICyfRudweND4mgACkIFGDFCo1FplJIBJoZABZWHDBFICyRZK0eauPb+NbOOZuAkIXwqklxFU45FzGzOGl0651RmFMB8OSs9kKAAiXIhvO0YvhJERO1iqI1yysM12vhsatccy1cTxpxSHlWRp+-Xy93NfBkQmFmgAaqDZNzIXyXSNJWNnF4Q3ZXCdnM4MTNfc41bN0hkQJgiBA4GZjb940y6IxmFVYzc8xLQGMvIHwoTKbQFo4ZitVrMx4bGx247cCo8SmUKl9eiaBpKhq7TAXELEHK40fZ-Cqkgu1bFnKHkZSy95jjGamuzZvnm8PruA51EObqnuqdhWE+cxzPMvjrFYszYmqjirI4Tizskl64ueY6fvSpobjQIEniO1ghBOCDzGhhxlhMCHVg2qRAA */
const machine = createMachine(
  {
    id: "transactions-on-date",
    schema: {
      context: {} as {
        date: string;
        total: number;
        transactions: Record<string, any>;
      },
      events: {} as
        | { type: "OPEN_TRANSACTIONS_FORM" }
        | { type: "APPEND_TRANSACTION" }
        | { type: "REMOVE_TRANSACTION" }
        | { type: "FETCH_TRANSACTIONS" }
        | { type: "done.invoke.fetchTransactions"; data: TransactionEntity[] }
        | { type: "CLOSE_TRANSACTIONS" },
    },
    tsTypes: {} as import("./transactions-on-date-machine.typegen").Typegen0,
    initial: "hidingTransactions",
    states: {
      hidingTransactions: {
        on: {
          FETCH_TRANSACTIONS: {
            target: "fetchingTransactions",
          },
        },
      },
      fetchingTransactions: {
        invoke: {
          src: "fetch",
          id: "fetchTransactions",
          onDone: [
            {
              actions: "set",
              target: "displayingTransactions",
            },
          ],
        },
      },
      displayingTransactions: {
        entry: "display",
        on: {
          CLOSE_TRANSACTIONS: {
            actions: "hide",
            target: "hidingTransactions",
          },
        },
      },
    },
    on: {
      OPEN_TRANSACTIONS_FORM: {
        actions: "notifyOpenForm",
      },
      APPEND_TRANSACTION: {
        actions: "append",
      },
      REMOVE_TRANSACTION: {
        actions: "remove",
      },
    },
  },
  {
    services: {
      fetch: (context) => fetchTransactionsForDate(context.date),
    },
    actions: {
      set: assign({
        transactions: (_, event) =>
          event.data.reduce(
            (previous, current) => ({
              ...previous,
              [current.uuid]: spawn(createTransactionMachine(current)),
            }),
            {}
          ),
      }),
      append: () => {},
      notifyOpenForm: () => {},
      remove: () => {},
      display: () => {},
      hide: () => {},
    },
  }
);

export function createTransactionsOnDateMachine({
  date,
  total,
}: {
  date: string;
  total: number;
}) {
  return machine.withContext({
    date,
    total,
    transactions: {},
  });
}
