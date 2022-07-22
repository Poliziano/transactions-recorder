// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    notifySubmit: "SUBMIT";
    assignAmount: "UPDATE_AMOUNT";
    assignDate: "UPDATE_DATE";
    assignName: "UPDATE_NAME";
    notifyClose: "CLOSE";
  };
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    canSubmit: "SUBMIT";
  };
  eventsCausingDelays: {};
  matchesStates: "displaying";
  tags: never;
}
