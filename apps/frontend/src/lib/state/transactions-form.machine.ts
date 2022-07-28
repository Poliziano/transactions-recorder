import type {
  TransactionEntity,
  TransactionEntityCreateParams,
} from "$lib/api/transaction";
import { assign, createMachine, sendParent } from "xstate";
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

type FormFields = {
  uuid?: string;
  userId: string;
  name: string;
  amount: string;
  date: string;
  type: TransactionEntity["type"];
  error?: string | null;
};

type FormDefaults = RequiredFields<FormFields, "date" | "userId">;
export type FormContext = OptionalFields<FormFields, "uuid">;

export type FormEvents =
  | { type: "SUBMIT" }
  | { type: "error.platform.submit"; data: Error }
  | { type: "done.invoke.submit"; data: TransactionEntity }
  | { type: "OPEN"; data: FormDefaults }
  | { type: "UPDATE_AMOUNT"; data: string }
  | { type: "UPDATE_DATE"; data: string }
  | { type: "UPDATE_NAME"; data: string }
  | { type: "UPDATE_TYPE"; data: FormContext["type"] }
  | { type: "CLOSE" };

/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPbYC0AZkagLYB0EBsADgDboCeBmUAxAMoBVAEIBZAJIAVRKCZFYBQiWkgAHogBsAdgAMtAIwBOAKwBmEwCZNJg+pNWANCHYbtm2gBYDXgByaj6vW1-EwBfEMc0LBx8YjJKGnpGVg4uXgEABQARAEEJAFEAfWyRAHkBADkpJBBZeUVMZTUEbwNdc3cA8z0jTWNtPXdHZwR3O1ovL01Nb3VzFvVvMIiMbDx62AoqOgZmNk5uHgyc-ILjvOVahVjGxAM9c1oAs3bzIwNzczuhxAs9cYmDCZtO5zLN3Jp3EsQJFVjESBt4tskntUocsrlCuViudqpd6jcEK0DLQTEYyf1bAZ3IF1N8EOYgv8Ju1AnoTAEoTDoutNgkdsl9ml0ScJABNdI4mRyK5KapNO4mWiubx6TR6bzAvSdOktJkTBZ2MkLTkrbmxBFbRK7FIHADCABkSnxJTVpfi5YgIe4PKZVUFrOrrHT1d7PD5ZjZXK1IeFoaa1ubeXRcCw5JAeCUJeULm7rh6EFpdIZTBYrDY7CY6ZY-mGDDNPuooyaogn4UnaLAAK4AI2oCkIBwgJDAtC4ADciABrEdd3sKHN1POgJoN2gtbyjTw6YFGQZORCgtzeMwmAbAl53IzN2E8xEdnt95AD3hgVCoKi0ZLIO+zx8LmUNPmq7rpuBjbu4u50hBioAr0Zi+No7KaGEsaYEQEBwMoXKtnElr8ii3D-u6y6IN4urqMYpLAp4p5eHSszeHqKrqD03hzIssbYXCuEJCmaYQERS6qIgHTEnoqqGK8bxEnYVY6GuJ5zJYJggu42jqNeZptj+D79qkgmyiRIzmFB1IeBMEJ3Pcx6aThFo0AZgFGeqwaMdo7keZ5nnIShQA */
const machine = createMachine(
  {
    context: {} as FormContext,
    tsTypes: {} as import("./transactions-form.machine.typegen").Typegen0,
    schema: { context: {} as FormContext, events: {} as FormEvents },
    initial: "closed",
    states: {
      displaying: {
        entry: "logEvent",
        on: {
          SUBMIT: {
            actions: ["logEvent", "removeError"],
            cond: "canSubmit",
            target: "submitting",
          },
          UPDATE_AMOUNT: {
            actions: ["assignAmount", "logEvent"],
            cond: "isNumber",
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
            actions: ["assignDefaults", "logEvent", "removeError"],
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
              actions: ["logEvent", "sendTransaction"],
              target: "closed",
            },
          ],
          onError: [
            {
              actions: ["logEvent", "assignError"],
              target: "displaying",
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
        amount: (_context, event) => removeLeadingZeros(event.data),
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
      assignError: assign({
        error: (_context, event) => event.data.message,
      }),
      removeError: assign({
        error: (_context, _event) => null,
      }),
      sendTransaction: sendParent((_context, event) => ({
        type: "NEW_TRANSACTION",
        data: event.data,
      })),
      logEvent: log((context, event) => ({
        context,
        event,
      })),
    },
    guards: {
      canSubmit: (context) => validation.safeParse(context).success,
      isNumber: (_context, event) => isNumericString(event.data),
    },
    services: {
      submit: (context) => createTransaction(convertToEntity(context)),
    },
  }
);

function isNumericString(value: string) {
  return value === "" || !isNaN(parseFloat(value));
}

function removeLeadingZeros(value: string) {
  const numberRegex = /^0*([0-9]+\.?[0-9]*)$/;
  const result = value.match(numberRegex);

  return result == null ? value : result[1];
}

function convertToEntity(context: FormContext): TransactionEntityCreateParams {
  const { userId, name, amount, date, type } = context;
  return {
    userId,
    name,
    date,
    type,
    amount: parseFloat(amount),
  };
}

const validation: z.ZodType<Omit<FormContext, "error">> = z.object({
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
