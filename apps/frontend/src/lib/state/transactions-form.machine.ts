import type {
  TransactionEntity,
  TransactionEntityCreateParams,
} from "$lib/api/transaction";
import { assign, createMachine, sendParent } from "xstate";
import { z } from "zod";

/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPbYC0AZkagLYB0EBsADgDboCeBmUAxAMoBVAEIBZAJIAVRKCZFYBQiWkgAHogAsAJloAGPfoP6AjOoA0IdhoDMATl36rAVnVGbVgGyOrAX2-m0WDj4xGSUNPSMrBxcvAIACgAiAIISAKIA+kkiAPICAHJSSCCy8oqYymoI6nYAHJo1Rpqa6gDseupe7uaWCE7aBk4ubp4+fiAB2HhlsBRUdAzMbJzcPPHJaenrqcolCiEViO7quq6OZ-Ud7m6a3YianvZ6g64eXr7+GJPBJDNh85FLGKrRIpDJ5LLbIq7MoHBDuHS0FpWOruJF9apWFqOW4IIwtGqPJ4tGwYzTvcafILTWbhBZRZa8ADCABlsnxITI5HslEVKi0jLR7nj1DpNM53CZ3F0LIgbALDJiSddfGNMEQIHBlBMqSFfnMIototwdlyYbzEI4CUi6i1qmKjEYrB4cfD5fomi0ro4bJojOTtVNdTTqCbSvtzbiCYZo3oTDijDUVd4gA */
const machine = createMachine(
  {
    tsTypes: {} as import("./transactions-form.machine.typegen").Typegen0,
    schema: {
      context: {} as Pick<TransactionEntity, "date" | "userId"> &
        Omit<Partial<TransactionEntity>, "date" | "userId">,
      events: {} as
        | { type: "SUBMIT" }
        | { type: "UPDATE_AMOUNT"; data: number }
        | { type: "UPDATE_DATE"; data: string }
        | { type: "UPDATE_NAME"; data: string }
        | { type: "CLOSE" },
    },
    initial: "displaying",
    states: {
      displaying: {
        on: {
          SUBMIT: {
            actions: "notifySubmit",
            cond: "canSubmit",
          },
          UPDATE_AMOUNT: {
            actions: "assignAmount",
          },
          UPDATE_DATE: {
            actions: "assignDate",
          },
          UPDATE_NAME: {
            actions: "assignName",
          },
          CLOSE: {
            actions: "notifyClose",
          },
        },
      },
    },
    id: "transactions-form",
  },
  {
    actions: {
      notifySubmit: sendParent((context) => ({
        type: "SUBMIT",
        data: context,
      })),
      notifyClose: sendParent("CLOSE"),
      assignAmount: assign({
        amount: (_context, event) => event.data,
      }),
      assignDate: assign({
        date: (_context, event) => event.data,
      }),
      assignName: assign({
        name: (_context, event) => event.data,
      }),
    },
    guards: {
      canSubmit: (context) => validation.safeParse(context).success,
    },
  }
);

const validation: z.ZodType<TransactionEntityCreateParams> = z.object({
  date: z.string(),
  userId: z.string(),
  name: z.string(),
  amount: z.number(),
  type: z.enum(["income", "expenditure"]),
  uuid: z.optional(z.string()),
});

type CreateTransactionsOnDateMachineInput = {
  transaction: Pick<TransactionEntity, "date" | "userId"> &
    Omit<Partial<TransactionEntity>, "date" | "userId">;
};
export function createTransactionsFormMachine({
  transaction,
}: CreateTransactionsOnDateMachineInput) {
  return machine.withContext(transaction);
}
