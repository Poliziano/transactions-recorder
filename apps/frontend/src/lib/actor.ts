import type { AnyActorRef } from "xstate";

export function actor(
  node: HTMLInputElement | HTMLSelectElement,
  { actor, type }: { actor: AnyActorRef; type: string }
) {
  const syncNodeToState = ({ context }: { context: any }) => {
    console.log("NEXT STATE", context);
    const newInputValue = context[node.name]?.toString();

    if (newInputValue && newInputValue != node.value) {
      node.value = newInputValue;
    }
  };

  const sendInputEvent = (event: Event) => {
    if (event.target == null) {
      return;
    }
    const inputEvent = event.target as HTMLInputElement;
    console.log(event);
    actor.send({ type, data: inputEvent.value } as any);
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
