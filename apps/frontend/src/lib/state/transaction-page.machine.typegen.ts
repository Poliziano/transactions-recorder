// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    assignTransactions: "done.invoke.fetchingTransactions";
    sendTransactionUpdatedEvent: "done.invoke.submittingTransaction";
    removeFormFields: "xstate.init";
    assignFormFields: "OPEN_TRANSACTIONS_FORM";
  };
  internalEvents: {
    "done.invoke.fetchingTransactions": {
      type: "done.invoke.fetchingTransactions";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.submittingTransaction": {
      type: "done.invoke.submittingTransaction";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
    "error.platform.fetchingTransactions": {
      type: "error.platform.fetchingTransactions";
      data: unknown;
    };
    "error.platform.submittingTransaction": {
      type: "error.platform.submittingTransaction";
      data: unknown;
    };
  };
  invokeSrcNameMap: {
    fetchTransactions: "done.invoke.fetchingTransactions";
    createTransaction: "done.invoke.submittingTransaction";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    fetchTransactions: "FETCH_TRANSACTIONS";
    createTransaction: "SUBMIT_TRANSACTION_FORM";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "transactions"
    | "transactions.waiting"
    | "transactions.fetchingTransactions"
    | "form"
    | "form.closed"
    | "form.opened"
    | "form.submitting"
    | {
        transactions?: "waiting" | "fetchingTransactions";
        form?: "closed" | "opened" | "submitting";
      };
  tags: never;
}
