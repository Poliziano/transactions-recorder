import type { AnyActorRef } from "xstate";

export function actorController(
  node: HTMLInputElement | HTMLSelectElement,
  { actor, send }: { actor: AnyActorRef; send: string }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const syncNodeToState = ({ context }: { context: any }) => {
    node.value = context[node.name]?.toString();
  };

  const sendInputEvent = (event: Event) => {
    actor.send({ type: send, data: extractInputValue(event) });
  };

  const sync = actor.subscribe(syncNodeToState);
  node.addEventListener("input", sendInputEvent);

  return {
    destroy() {
      sync.unsubscribe();
      node.removeEventListener("input", sendInputEvent);
    },
  };
}

function extractInputValue(event: Event) {
  if (!(event instanceof InputEvent)) {
    return extractRawTargetValue(event);
  }

  const { target, data, inputType } = event;
  const { type, value, valueAsNumber } = target as HTMLInputElement;

  if (type !== "number") {
    return value;
  }

  const isDelete = data == null && inputType === "deleteContentBackward";
  return !isNaN(valueAsNumber) || isDelete ? value : null;
}

function extractRawTargetValue(event: Event) {
  return event.target instanceof HTMLSelectElement ||
    event.target instanceof HTMLInputElement
    ? event.target.value
    : null;
}
