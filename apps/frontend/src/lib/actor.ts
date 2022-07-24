import type { AnyActorRef } from "xstate";

export function actor(
  node: HTMLInputElement | HTMLSelectElement,
  { service, type }: { service: AnyActorRef; type: string }
) {
  const sync = service.subscribe(({ context }) => {
    const newInputValue = context[node.name]?.toString();

    if (newInputValue && newInputValue != node.value) {
      node.value = newInputValue;
    }
  });

  node.addEventListener("input", (event) => {
    if (event.target == null) {
      return;
    }
    const inputEvent = event.target as HTMLInputElement;
    service.send({ type, data: inputEvent.value });
  });

  return {
    destroy: sync.unsubscribe,
  };
}
