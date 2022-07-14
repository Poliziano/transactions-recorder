// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    showOptions: "OPEN_OPTIONS";
    hideOptions: "CLOSE_OPTIONS" | "DELETE";
    notifyParent: "done.invoke.deleteTransaction";
  };
  internalEvents: {
    "done.invoke.deleteTransaction": {
      type: "done.invoke.deleteTransaction";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
    "error.platform.deleteTransaction": {
      type: "error.platform.deleteTransaction";
      data: unknown;
    };
  };
  invokeSrcNameMap: {
    delete: "done.invoke.deleteTransaction";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    delete: "DELETE";
  };
  eventsCausingGuards: {
    optionsClosed: "OPEN_OPTIONS";
    optionsOpen: "CLOSE_OPTIONS";
  };
  eventsCausingDelays: {};
  matchesStates: "active" | "deleting" | "deleted";
  tags: never;
}
