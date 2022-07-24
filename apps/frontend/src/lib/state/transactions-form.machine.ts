import type { TransactionEntity } from "$lib/api/transaction";
import { assign, createMachine } from "xstate";
import { log } from "xstate/lib/actions";
import { z } from "zod";
import { createTransaction } from "./transactions.service";

type OptionalFields<TObject, TKey extends keyof TObject> = {
  [Property in keyof TObject as Property extends TKey
    ? never
    : Property]-?: TObject[Property];
} & {
  [Property in keyof TObject as Property extends TKey
    ? Property
    : never]+?: TObject[Property];
};

type RequiredFields<TObject, TKey extends keyof TObject> = {
  [Property in keyof TObject as Property extends TKey
    ? Property
    : never]-?: TObject[Property];
} & {
  [Property in keyof TObject as Property extends TKey
    ? never
    : Property]+?: TObject[Property];
};

type FormFields = Omit<TransactionEntity, "amount"> & {
  amount: string;
};

type FormDefaults = RequiredFields<FormFields, "date" | "userId">;
export type FormContext = OptionalFields<FormFields, "uuid">;

export type FormEvents =
  | { type: "SUBMIT" }
  | { type: "OPEN"; data: FormDefaults }
  | { type: "UPDATE_AMOUNT"; data: string }
  | { type: "UPDATE_DATE"; data: string }
  | { type: "UPDATE_NAME"; data: string }
  | { type: "UPDATE_TYPE"; data: FormContext["type"] }
  | { type: "CLOSE" };

/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPbYC0AZkagLYB0EBsADgDboCeBmUAxAMoBVAEIBZAJIAVRKCZFYBQiWkgAHogBMAVgAstAByaAnAGYA7GeOaADOvUA2UwBoQ7DacO0tVq3e2aAjMZ62saGAL5hzmhYOPjEZJQ09IysHFy8AgAKACIAghIAogD6uSIA8gIAclJIILLyipjKagiamrT+vj56euraPXZ2bc6uCMbqxrTe3saDwcba9hFRGNh4jbAUVHQMzGyc3DxZeYVFJwXK9QrxzYh2HpY6Br2m-iaGTi4aVqZT0+o2UJ2CzLEDRNZxEibRI7FL7dJHHL5YqVUoXWpXRq3BCDKamRaBe7eQw+T6jQz+P7TMyGbQmN56UHg2IbLZJXapA68ADCABkynx0TI5NclLUWlpdAYTOZzNZbA4Roh+upPNYrJpjP51CTtO47EzViz4tDtrRcCw5JAeGVMgVKpcRVjxXdDHZaPjDF67ADrHY9P4lQhte1TOrTOp-FYzD8eoaYusTWy6LAAK4AI2oCkIhwgJDAtC4ADciABrAtpzMKR0NG4unFuj1072+7qBr5jfy6Lw-bTefz+cx6A2gzBECBwZTMxNQ5PJPZpbg10VNet6oPaTdUjVanVWPXBeMQ1kw82W2CQZfO0AtAy6Lt6Bb2eymbzqIPGfce9WLMwOPuaKYR7GrOp6VlmyA5lAV51jeyqaKq+7+sOQR6m6+5BuowRqt4wJ9AMgzATOCTbDBYpwQgExBv4jIRGEQA */
const machine = createMachine(
  {
    context: {} as FormContext,
    tsTypes: {} as import("./transactions-form.machine.typegen").Typegen0,
    schema: {
      context: {} as FormContext,
      events: {} as FormEvents,
    },
    initial: "closed",
    states: {
      displaying: {
        entry: "logEvent",
        on: {
          SUBMIT: {
            actions: "logEvent",
            cond: "canSubmit",
            target: "submitting",
          },
          UPDATE_AMOUNT: {
            // cond: "isNumber",
            actions: ["assignAmount", "logEvent"],
          },
          UPDATE_DATE: {
            actions: ["assignDate", "logEvent"],
          },
          UPDATE_NAME: {
            actions: ["assignName", "logEvent"],
          },
          UPDATE_TYPE: {
            actions: ["assignType", "logEvent"],
          },
          CLOSE: {
            actions: "logEvent",
            target: "closed",
          },
        },
      },
      closed: {
        entry: "logEvent",
        on: {
          OPEN: {
            actions: ["assignDefaults", "logEvent"],
            target: "displaying",
          },
        },
      },
      submitting: {
        entry: "logEvent",
        invoke: {
          src: "submit",
          id: "submit",
          onDone: [
            {
              actions: "logEvent",
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
      assignDefaults: assign((_context, event) => ({
        name: "",
        amount: "",
        type: "expenditure" as FormDefaults["type"],
        ...event.data,
      })),
      assignAmount: assign({
        amount: (context, event) =>
          isNumeric(event.data) ? event.data : context.amount,
      }),
      assignDate: assign({
        date: (_context, event) => event.data,
      }),
      assignName: assign({
        name: (_context, event) => event.data,
      }),
      assignType: assign({
        type: (_context, event) => event.data,
      }),
      logEvent: log((context, event) => ({
        context,
        event,
      })),
    },
    guards: {
      canSubmit: (context) => validation.safeParse(context).success,
      isNumber: (_context, event) => isNumeric(event.data),
    },
    services: {
      submit: createTransaction,
    },
  }
);

function isNumeric(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }

  const output =
    // @ts-expect-error isNan is wrong
    !isNaN(value) && !isNaN(parseFloat(value));
  return output;
}

const validation: z.ZodType<FormContext> = z.object({
  date: z.string(),
  userId: z.string(),
  name: z.string(),
  amount: z.string(),
  type: z.enum(["income", "expenditure"]),
  uuid: z.optional(z.string()),
});

export function createTransactionsFormMachine() {
  return machine;
}
