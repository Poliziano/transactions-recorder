// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    assignTransactions: "done.invoke.fetchingTransactions:invocation[0]";
    sendTransactionUpdatedEvent: "done.invoke.submittingTransaction:invocation[0]";
    removeFormFields: "xstate.init";
    assignFormFields: "OPEN_TRANSACTIONS_FORM";
  };
  internalEvents: {
    "done.invoke.fetchingTransactions:invocation[0]": {
      type: "done.invoke.fetchingTransactions:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.submittingTransaction:invocation[0]": {
      type: "done.invoke.submittingTransaction:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    fetchTransactions: "done.invoke.fetchingTransactions:invocation[0]";
    createTransaction: "done.invoke.submittingTransaction:invocation[0]";
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
