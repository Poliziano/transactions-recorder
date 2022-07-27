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
    const data = extractEventData(event);

    if (data != null) {
      actor.send({ type: send, data } as any);
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

function extractEventData(event: Event): null | any {
  if (event.target == null) {
    return null;
  }

  if (event instanceof InputEvent) {
    return extractInputEventData(event);
  }

  if (event.target instanceof HTMLSelectElement) {
    return extractSelectEventData(event);
  }

  return null;
}

function extractInputEventData(event: InputEvent) {
  const { target, data, inputType } = event;
  const { type, value, valueAsNumber } = target as HTMLInputElement;

  const isNumberInput = type === "number";
  const isValidNumber = isNumberInput && !isNaN(valueAsNumber);
  const isDelete = data == null && inputType === "deleteContentBackward";

  return !isNumberInput || isValidNumber || isDelete ? value : null;
}

function extractSelectEventData(event: Event) {
  const { value } = event.target as HTMLSelectElement;
  return value;
}
