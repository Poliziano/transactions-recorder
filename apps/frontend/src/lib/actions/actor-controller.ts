import type { AnyActorRef } from "xstate";

export function actorController(
  node: HTMLInputElement | HTMLSelectElement,
  { actor, send }: { actor: AnyActorRef; send: string }
) {
  const syncNodeToState = ({ context }: { context: any }) => {
    const newInputValue = context[node.name]?.toString();

    if (newInputValue != null) {
      node.value = newInputValue;
    }
  };

  const sendInputEvent = (event: Event) => {
    console.log(event);
    const data = extractInputValue(event);

    if (data != null) {
      actor.send({ type: send, data });
    } else {
      // No event is sent, resulting in the input becoming out of sync with the state.
      syncNodeToState(actor.getSnapshot());
    }
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
