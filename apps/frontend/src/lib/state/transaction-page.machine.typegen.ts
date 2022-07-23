// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    openForm: "OPEN_TRANSACTIONS_FORM";
    assignTransactions: "done.invoke.fetchingTransactions";
  };
  internalEvents: {
    "done.invoke.fetchingTransactions": {
      type: "done.invoke.fetchingTransactions";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
    "error.platform.fetchingTransactions": {
      type: "error.platform.fetchingTransactions";
      data: unknown;
    };
  };
  invokeSrcNameMap: {
    fetchTransactions: "done.invoke.fetchingTransactions";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    fetchTransactions: "FETCH_TRANSACTIONS";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "waiting" | "fetchingTransactions";
  tags: never;
}
