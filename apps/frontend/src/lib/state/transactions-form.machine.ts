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
  | { type: "OPEN"; data: FormDefaults }
  | { type: "UPDATE_AMOUNT"; data: string }
  | { type: "UPDATE_DATE"; data: string }
  | { type: "UPDATE_NAME"; data: string }
  | { type: "UPDATE_TYPE"; data: FormContext["type"] }
  | { type: "CLOSE" };

/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPbYC0AZkagLYB0EBsADgDboCeBmUAxAMoBVAEIBZAJIAVRKCZFYBQiWkgAHogBsAVgBMtAAwAOTQE4AzKb0B2bZstmANCHYartACzHPBy5vUBGPV9TAF9gxzQsHHxiMkoaekZWDi5eAQAFABEAQQkAUQB9LJEAeQEAOSkkEFl5RUxlNQRvXT9TdWs-Yz9tNzdTN0dnBD7LWk9PS0sDdW0DY3a3UPCMbDw62AoqOgZmNk5uHnTsvPzj3OUahRiGxDm3Wk09U2Mek20-S1bBxFN3sfGzHo3NoZm5LEsQBFVtESBs4ttEnsUodMjkCmUiucqpc6jcml1aD1-HpOtZTDp1N8ENpAv9xj0Aq11E8IVCoutNvEdkl9qlUScJABNNJYmRyK5KKqNO5jdTeDqmT5PUxUuZ08ZyxWaXwGVkrdkxOFbBK7ZIHADCABlinxRdVxbipYhrOpaP1FZZDB0QVS-AZ7o89EH3oZtMYgnrImtDZy6LgWHJIDxiiKyhcHdcnQgtLpDCZzFYbHYVU5ENpPg8g8GAgYwxGwpD9dHYbHaLAAK4AI2oCkIBwgJDAtC4ADciABrIcd7sKdO1TOgRph11zf2PKbaEE0zRU2a6czmTozYxubptSPQjnwttdnvIPu8MCoVBUWhJZDX6d3ucS+pZ5e0KubjrrWW6BFSwGmOqxamN4TzghCmBEBAcDKGyzaxMa3JItwP6OoutwVpoRjhlYoEzFSMwGOqBh+FoG4GLqDboTCmHxPGiYQHhC6qIgwF+PoVh2LMLxGH4AyltSnqAQeNjqLBgRuFoF4Gi2n63r2KTcZKBHDNoEGnu44yWB4fjdAYITMU2rFGjQ2l-rpfq+tRVauW5QYIaEQA */
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
              actions: "logEvent",
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
      submit: createTransaction,
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
