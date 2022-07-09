// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    sendOpenTransactionForm: "OPEN_TRANSACTION_FORM";
    appendTransaction: "TRANSACTION_CREATED";
    assignTransactions: "done.invoke.fetchingTransactions:invocation[0]";
  };
  internalEvents: {
    "done.invoke.fetchingTransactions:invocation[0]": {
      type: "done.invoke.fetchingTransactions:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    fetchTransactions: "done.invoke.fetchingTransactions:invocation[0]";
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
  matchesStates: "closed" | "fetchingTransactions" | "displayingTransactions";
  tags: never;
}
