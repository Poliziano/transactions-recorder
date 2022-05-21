// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    assignTransactions: "done.invoke.fetchingTransactions:invocation[0]";
    appendTransaction: "done.invoke.creatingTransaction:invocation[0]";
    removeTransaction: "done.invoke.deletingTransaction:invocation[0]";
  };
  internalEvents: {
    "done.invoke.fetchingTransactions:invocation[0]": {
      type: "done.invoke.fetchingTransactions:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.creatingTransaction:invocation[0]": {
      type: "done.invoke.creatingTransaction:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.deletingTransaction:invocation[0]": {
      type: "done.invoke.deletingTransaction:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    fetchTransactions: "done.invoke.fetchingTransactions:invocation[0]";
    createTransaction: "done.invoke.creatingTransaction:invocation[0]";
    deleteTransaction: "done.invoke.deletingTransaction:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    fetchTransactions: "FETCH_TRANSACTIONS";
    createTransaction: "CREATE_TRANSACTION";
    deleteTransaction: "DELETE_TRANSACTION";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "waiting"
    | "fetchingTransactions"
    | "creatingTransaction"
    | "deletingTransaction";
  tags: never;
}
