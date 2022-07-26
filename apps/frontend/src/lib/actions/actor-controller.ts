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
    if (event.target == null || !(event instanceof InputEvent)) {
      return;
    }

    const { target, data, inputType } = event;
    const { type, value, valueAsNumber } = target as HTMLInputElement;

    const isNumberInput = type === "number";
    const isValidNumber = isNumberInput && !isNaN(valueAsNumber);
    const isDelete = data == null && inputType === "deleteContentBackward";

    if (!isNumberInput || isValidNumber || isDelete) {
      actor.send({ type: send, data: value } as any);
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
