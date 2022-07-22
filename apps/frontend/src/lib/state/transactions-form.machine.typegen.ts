// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    assignAmount: "UPDATE_AMOUNT";
    assignDate: "UPDATE_DATE";
    assignName: "UPDATE_NAME";
    assignDefaults: "OPEN";
  };
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
    "done.invoke.submit": {
      type: "done.invoke.submit";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.submit": { type: "error.platform.submit"; data: unknown };
  };
  invokeSrcNameMap: {
    submit: "done.invoke.submit";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    submit: "SUBMIT";
  };
  eventsCausingGuards: {
    canSubmit: "SUBMIT";
  };
  eventsCausingDelays: {};
  matchesStates: "displaying" | "closed" | "submitting";
  tags: never;
}
