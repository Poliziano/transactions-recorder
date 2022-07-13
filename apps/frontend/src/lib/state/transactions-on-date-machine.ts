import type { TransactionEntity } from "$lib/api/transaction";
import type { TransactionFormParams } from "$lib/transaction-form";
import {
  assign,
  createMachine,
  sendParent,
  spawn,
  type ActorRefFrom,
} from "xstate";
import { createTransactionMachine } from "./transaction-machine";
import { fetchTransactionsForDate } from "./transactions.service";

/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPbYC0JpE6yYAdABYEQGZQAqG2ehJsAxADEAomwDCACQD6bAEoBBAHIBlOaLYBJAPLLEoAA5FYBHpl0gAHogBMAdgAMtAMwBWAJyOALI6vuPV5y4ANCAAnojOdja0rjGukY4AHAlWAIwekQC+GcFoWDj4xGQUVDS0AGZgyLiMrBx53IX8ECR0LABuRADWdBVV9HVcBbxmBkYmZpYINjG0ASlWAGyLyUsxwWEIHkm0HrELNguOkXYLWTmc+Saw5JiU1HTMsHoANughLOwXDbx8ogAymiUQmk8mUqg02iUI0MxkKE0QCTsHmiPhsbisPiWNgS60QLgW0ViNg8hw8xLsjjOIFygyuNzuND4mgACkIFCDFCo1FplJIBJoZABZaFjOFICzhI60KwJVwpTx2VI2FILXEIFIJZyE2I6nU2Kk0y6NeklMB8OTM1kKAAiHLB3O0IthJHhCGcuxRKVcVi8thS8psatcCW1ut1+uy1K+QyKt1NfBkQkFmgAasDZJzwTyneNxZN3SG7K4DgkFs45gtXGr5llI5giBA4GZDd9Ywy6IxmLVo1cc2LQJMyWqXCHHGP-GXiQlPAcDT3jcV7uVKtUPgMjcNxaNnaY84hdg5va5K-Z-cWfWqyQTdjF9odjm5nHP6jHrovSo8Xm81-PN-oYbmA6ICkipakkPjyseIGJFWoR4gsDjTmORaHM49h2KWz60gucb3H2Lp7ggViOGqMoeLWGRAA */
const machine = createMachine(
  {
    id: "transactions-on-date",
    tsTypes: {} as import("./transactions-on-date-machine.typegen").Typegen0,
    schema: {
      context: {} as {
        date: string;
        total: number;
        transactions: Record<
          string,
          ActorRefFrom<typeof createTransactionMachine>
        >;
      },
      events: {} as
        | { type: "OPEN_TRANSACTIONS_FORM"; data: TransactionFormParams }
        | { type: "APPEND_TRANSACTION"; data: TransactionEntity }
        | { type: "REMOVE_TRANSACTION"; data: TransactionEntity["uuid"] }
        | { type: "FETCH_TRANSACTIONS" }
        | { type: "done.invoke.fetchTransactions"; data: TransactionEntity[] }
        | { type: "CLOSE_TRANSACTIONS" },
    },
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
        on: {
          CLOSE_TRANSACTIONS: {
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
              [current.uuid]: spawn(
                createTransactionMachine({ transaction: current })
              ),
            }),
            {}
          ),
        total: (_, event) =>
          event.data.reduce(
            (previous, current) => previous + current.amount,
            0
          ),
      }),
      append: assign({
        transactions: (context, event) => {
          context.transactions[event.data.uuid] = spawn(
            createTransactionMachine({ transaction: event.data })
          );
          return context.transactions;
        },
        total: (context, event) => context.total + event.data.amount,
      }),
      remove: assign({
        transactions: (context, event) => {
          const actor = context.transactions[event.data];
          actor.stop?.();
          delete context.transactions[event.data];
          return context.transactions;
        },
        total: (context, event) => {
          return Object.values(context.transactions).reduce(
            (previous, current) => {
              const snapshot = current.getSnapshot()?.context;
              if (
                snapshot?.transaction == null ||
                snapshot.transaction.uuid === event.data
              ) {
                return previous;
              }
              return previous + snapshot.transaction.amount;
            },
            0
          );
        },
      }),
      notifyOpenForm: sendParent((_context, event) => event),
    },
  }
);

type CreateTransactionsOnDateMachineInput = {
  date: string;
  total: number;
};
export function createTransactionsOnDateMachine({
  date,
  total,
}: CreateTransactionsOnDateMachineInput) {
  return machine.withContext({
    date,
    total,
    transactions: {},
  });
}
