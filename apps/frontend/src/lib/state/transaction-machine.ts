import type { TransactionEntity } from "$lib/api/transaction";
import { assign, createMachine, sendParent } from "xstate";
import { deleteTransaction } from "./transactions.service";

/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPaYB0ehAbmAMQAiAogDIMAqDioADkbAYSU4gAHogBMAVgCcpKQDYADFIDMAdjEAOKVrliANCACeiACwBGCbKnX1UixIli5ygL4uDaLDnzEyFAtQ0APIACgwAcgD6oawAkkHhAMpCPHwCmEKiCCb6RuImGqQKxcWqZcoaJkqu7iCe2P4k5D6BAMJMQYkM0SFxCclIIKn8vpmmcrISymaSCo7zKiYGxgh2RSVmcmZl1spiNR4YDT5NEGAANmCEmFA0ECRgpASYlEQA1o9nl8hgrEfe6RSvBGgkGWTkGlUpGU0mUugUqg0WwkGmWpgsVhsYjsDkczjctUwRDO8EG9QBvmaVDAQLSozBiA0lkUFjksLEqmKZiWeWySkx1hUcnkGkhbkOXkaZC+V2eUFpIIyDIQcJkqhMgrk6uUyikSlUaJVcgmGsFuskKmUJhM4rq-ylpBlPwgCsByrsJlIqitVqqSghGlyKwqntN2jMZn9CgjElt5KlrvpoCyZlRvNTBJcQA */
const machine = createMachine(
  {
    id: "transaction",
    tsTypes: {} as import("./transaction-machine.typegen").Typegen0,
    schema: {
      context: {} as {
        optionsOpen: boolean;
        transaction: TransactionEntity;
      },
      events: {} as
        | { type: "DELETE" }
        | { type: "OPEN_OPTIONS" }
        | { type: "CLOSE_OPTIONS" },
    },
    initial: "active",
    states: {
      active: {
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
        optionsOpen: (_context) => true,
      }),
      hideOptions: assign({
        optionsOpen: (_context) => false,
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

type CreateTransactionMachineInput = {
  transaction: TransactionEntity;
};
export function createTransactionMachine({
  transaction,
}: CreateTransactionMachineInput) {
  return machine.withContext({
    transaction,
    optionsOpen: false,
  });
}
