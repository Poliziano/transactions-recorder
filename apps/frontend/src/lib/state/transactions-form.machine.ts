import type {
  TransactionEntity,
  TransactionEntityCreateParams,
} from "$lib/api/transaction";
import { assign, createMachine } from "xstate";
import { z } from "zod";
import { createTransaction } from "./transactions.service";

type FormDefaults = Pick<TransactionEntity, "date" | "userId"> &
  Omit<Partial<TransactionEntity>, "date" | "userId">;

/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPbYC0AZkagLYB0EBsADgDboCeBmUAxAMoBVAEIBZAJIAVRKCZFYBQiWkgAHogBM6gBy0ArAGYAjOt2GtATgDsAFgBstgDQh2G9edrnP5rZe-rLhgaWAL7BTmhYOPjEZJQ09IysHFy8AgAKACIAghIAogD6WSIA8gIAclJIILLyipjKagjW6k4uCPoADPp6Hb2G+tqatuqh4RjYeHWwFFR0DMxsnNw86dl5+Wu5yjUKMQ2Iura0huaG1h3mF7Ynl4atGoZHur0d-YPq1+ajIBET0STTOJzRKLFIrTI5AplIpbKo7Or7BC6dQeQyvWwdWyWGzqTGOZyIYzuZ59AZaIYnb6-KJTGbxeZJJa8ADCABlinxYTI5LslFVGpodAZjKYLDZ7PcmmcPF4tI9dJZyT4qeMaTFAbNaLgWHJIDximlcmVtjyEfzEFiOrRmmYbPosaZjJLLjLPD4-AEDNYVZFJuq6XRYABXABG1AUhGWEBIYFoXAAbkQANax4NhhQm2p7c0IS3W9S26z2yyOloEhAfayuzw2Sy9ay6b3fTBECBwZTUv0AgMJBbJbiZ3n1HPPVHorrXQyWWz6ayS-TmXQ9UnvYY+v60oFanWwSCDs2gRrkyy0cldayWbS2Hy2XSSj6Ga1eS6mD4hMI-VVd2KatPh5CRlA+7ZoeiDNEuAQ3g2F7qAu+j3vo3TWM+6jWGi-S2OuardkCwF8qBCBmJKU7Vs+ZHmPooShEAA */
const machine = createMachine(
  {
    tsTypes: {} as import("./transactions-form.machine.typegen").Typegen0,
    schema: {
      context: {} as FormDefaults,
      events: {} as
        | { type: "SUBMIT" }
        | { type: "OPEN"; data: FormDefaults }
        | { type: "UPDATE_AMOUNT"; data: number }
        | { type: "UPDATE_DATE"; data: string }
        | { type: "UPDATE_NAME"; data: string }
        | { type: "CLOSE" },
    },
    initial: "closed",
    states: {
      displaying: {
        on: {
          SUBMIT: {
            cond: "canSubmit",
            target: "submitting",
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
            target: "closed",
          },
        },
      },
      closed: {
        on: {
          OPEN: {
            actions: "assignDefaults",
            target: "displaying",
          },
        },
      },
      submitting: {
        invoke: {
          src: "submit",
          id: "submit",
          onDone: [
            {
              target: "closed",
            },
          ],
        },
      },
    },
    id: "transactions-form",
  },
  {
    actions: {
      assignDefaults: assign((_context, event) => event.data),
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
    services: {
      submit: createTransaction,
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
  transaction: FormDefaults;
};
export function createTransactionsFormMachine({
  transaction,
}: CreateTransactionsOnDateMachineInput) {
  return machine.withContext(transaction);
}
