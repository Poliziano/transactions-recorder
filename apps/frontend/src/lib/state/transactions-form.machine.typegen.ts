// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    logEvent:
      | "SUBMIT"
      | "UPDATE_AMOUNT"
      | "UPDATE_DATE"
      | "UPDATE_NAME"
      | "UPDATE_TYPE"
      | "CLOSE"
      | "OPEN"
      | "done.invoke.submit";
    assignAmount: "UPDATE_AMOUNT";
    assignDate: "UPDATE_DATE";
    assignName: "UPDATE_NAME";
    assignType: "UPDATE_TYPE";
    assignDefaults: "OPEN";
  };
  internalEvents: {
    "done.invoke.submit": {
      type: "done.invoke.submit";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
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
