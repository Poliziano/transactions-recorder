// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    notifyOpenForm: "OPEN_TRANSACTIONS_FORM";
    append: "APPEND_TRANSACTION";
    remove: "REMOVE_TRANSACTION";
    set: "done.invoke.fetchTransactions";
    hide: "CLOSE_TRANSACTIONS";
    display: "done.invoke.fetchTransactions";
  };
  internalEvents: {
    "done.invoke.fetchTransactions": {
      type: "done.invoke.fetchTransactions";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
    "error.platform.fetchTransactions": {
      type: "error.platform.fetchTransactions";
      data: unknown;
    };
  };
  invokeSrcNameMap: {
    fetch: "done.invoke.fetchTransactions";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    fetch: "FETCH_TRANSACTIONS";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "hidingTransactions"
    | "fetchingTransactions"
    | "displayingTransactions";
  tags: never;
}
