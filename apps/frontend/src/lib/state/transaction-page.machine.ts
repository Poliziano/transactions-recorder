import type { TransactionEntity } from "$lib/api/transaction";
import type { TransactionFormParams } from "$lib/transaction-form";
import { assign, createMachine, send, spawn, type ActorRefFrom } from "xstate";
import { createTransactionsFormMachine } from "./transactions-form.machine";
import { createTransactionsOnDateMachine } from "./transactions-on-date.machine";
import { fetchTransactionsDailySum } from "./transactions.service";

type PageContext = {
  dates: Record<
    string,
    ActorRefFrom<ReturnType<typeof createTransactionsOnDateMachine>>
  >;
  form: ActorRefFrom<typeof createTransactionsFormMachine>;
};

type PageEvents =
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
      type: "NEW_TRANSACTION";
      data: TransactionEntity;
    };

/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPbYC0ADujAHQDu6BhmUAxAGICiAKgMIASAfS4AlAIIA5AMqieXAJIB5KYlDkisRsUwqQAD0QBGAKwA2agYAsADgsWATEaMBOJwAYnAZgA0IAJ6ILVytqD1CPAHYDOys7EyMwgF8EnzQsHHwtWAoqMGoAMzBkXAALAmYuDGw8QhJYFggSXLKANyIAa1yCotLyyvSa7B01DQGdfQRjM0sbe0cXd28-RA87AxCwyOjY+NCklL7qzOyYFgUABQ5xITEpGXklSQE2BWEAWSH1TRIxxDsncOoTgsBg8ThMINcBisIJ8-gQLmoriRyJRyIMexAqSqGVqxzALHEHAA6tcJNJZIpxB8RlofghQq5qBYTO4LB4DE47KDwmDYYY7ElkiBMEQIHAdFj+kdKDR6JpmNSvtokHoAuE+fT7NQjMjTDquXYgh4MZLDriZZ1CiUylAKmkzYMVcMlXTAk4mX8TCZwrFXB4THZ1Ut6YbEciPEZgZ44sahaacWQLYrRirxlyNRzwoKEkA */
const machine = createMachine(
  {
    tsTypes: {} as import("./transaction-page.machine.typegen").Typegen0,
    schema: { context: {} as PageContext, events: {} as PageEvents },
    entry: "setupContext",
    id: "transactions-page",
    initial: "waiting",
    on: {
      OPEN_TRANSACTIONS_FORM: {
        actions: "openForm",
      },
      NEW_TRANSACTION: {
        actions: "sendTransaction",
      },
    },
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
  {
    services: {
      fetchTransactions: fetchTransactionsDailySum,
    },
    actions: {
      setupContext: assign({
        form: () => spawn(createTransactionsFormMachine()),
        dates: {},
      }),
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
      openForm: send(
        (_context, event) => ({ type: "OPEN", data: event.data }),
        { to: (context) => context.form }
      ),
      sendTransaction: send(
        (_context, event) => ({
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
  return machine;
}
