// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.submit": {
      type: "done.invoke.submit";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.submit": { type: "error.platform.submit"; data: unknown };
    "xstate.init": { type: "xstate.init" };
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
  eventsCausingActions: {
    logEvent:
      | "SUBMIT"
      | "UPDATE_AMOUNT"
      | "UPDATE_DATE"
      | "UPDATE_NAME"
      | "UPDATE_TYPE"
      | "CLOSE"
      | "OPEN"
      | "done.invoke.submit"
      | "error.platform.submit"
      | "xstate.init";
    removeError: "SUBMIT";
    assignAmount: "UPDATE_AMOUNT";
    assignDate: "UPDATE_DATE";
    assignName: "UPDATE_NAME";
    assignType: "UPDATE_TYPE";
    assignDefaults: "OPEN";
    assignError: "error.platform.submit";
  };
  eventsCausingServices: {
    submit: "SUBMIT";
  };
  eventsCausingGuards: {
    canSubmit: "SUBMIT";
    isNumber: "UPDATE_AMOUNT";
  };
  eventsCausingDelays: {};
  matchesStates: "displaying" | "closed" | "submitting";
  tags: never;
}
