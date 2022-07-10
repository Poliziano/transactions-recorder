import type { TransactionEntity } from "$lib/api/transaction";
import { assign, createMachine, sendParent } from "xstate";
import { deleteTransaction } from "./transactions.service";

type Context = {
  optionsOpen: boolean;
  transaction: TransactionEntity;
};

type Events =
  | { type: "OPEN_OPTIONS" }
  | { type: "CLOSE_OPTIONS" }
  | { type: "DELETE" };

/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPaYB0EYAZugK4A2yAxACICiAMqwCquKgAORWAUIk+IAB6IAjAE4ADKQDMSgCwAmdaoCs8+dO0aANCACeiWQHZSq2XdkAOB9IBst9Q6UBfLybRYcfGIyCmp6JgB5AAVWADkAfWiuAEkI2IBlcUFhUUxxKQQAWmkla1dtJS1ZVWkdORcTcwR65RdPNssXDu1ZHz8MbDxc8ipaBkYAYXYI9NZEqJS0zKQQbJFg-Jk1Uk11O1VLJXkXS1kDRsR1PRsrxwdT+T3taT6Qf0GgkhG6MEJMKEYEBIYFIBEwADciABrEEUH7IMBcAaBXJZITrMQrAouWTqHb2VS2AwnaoXBBWUi6PTyJwuJSeEqqHy+ECYIgUeArd4o4IjMIMNE5DZYxDGMwWRT2RyWAzyWxqdSvblDXlw35gqCCjF5EUIFRKUiyFxUyzHSw6BzqMkHGxSnQ4pylJks5WfEJgeGQLWo3VG6yySpOY5GjRKWRk42U6mPRzPfSnJXIlWYgTon2gArFFzSUjlSq2Gp1I1kwrqbS2+xlhzHeRGhzMrxAA */
const transactionMachine = createMachine(
  {
    tsTypes: {} as import("./transaction-machine.typegen").Typegen0,
    schema: { context: {} as Context, events: {} as Events },
    id: "transaction",
    initial: "default",
    states: {
      default: {
        on: {
          DELETE: {
            target: "deleting",
          },
          OPEN_OPTIONS: {
            actions: "showOptions",
            cond: "optionsClosed",
          },
          CLOSE_OPTIONS: {
            actions: "hideOptions",
            cond: "optionsOpen",
          },
        },
      },
      deleting: {
        entry: "hideOptions",
        invoke: {
          src: "delete",
          id: "deleteTransaction",
          onDone: [
            {
              target: "deleted",
            },
          ],
        },
      },
      deleted: {
        entry: "notifyParent",
        type: "final",
      },
    },
  },
  {
    actions: {
      notifyParent: sendParent((context) => ({
        type: "TRANSACTION_DELETE",
        transaction: context.transaction,
      })),
      showOptions: assign({
        optionsOpen: (_) => true,
      }),
      hideOptions: assign({
        optionsOpen: (_) => false,
      }),
    },
    services: {
      delete: (context) => deleteTransaction(context.transaction.uuid),
    },
    guards: {
      optionsClosed: (context) => !context.optionsOpen,
      optionsOpen: (context) => context.optionsOpen,
    },
  }
);

export function createTransactionMachine(transaction: TransactionEntity) {
  return transactionMachine.withContext({
    transaction,
    optionsOpen: false,
  });
}
