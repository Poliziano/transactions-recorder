import { Interpreter } from "xstate";

export default function waitForState(
  service: Interpreter<any, any, any, any, any>,
  state: string
) {
  if (service.state.matches(state)) {
    return;
  }

  return new Promise<void>((resolve) => {
    service.onTransition(({ matches }) => {
      if (matches(state)) {
        resolve();
      }
    });
  });
}
