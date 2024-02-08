export let amountOutside: string[] = [];
export function handleAmountOutside(action: "add" | "remove", id: string) {
  if (action === "add" && !amountOutside.includes(id)) {
    amountOutside.push(id);
    if (amountOutside.length >= 4) {
      const button = document.querySelector<HTMLButtonElement>(
        "#button"
      ) as HTMLButtonElement;

      button.disabled = false;
    }
    return;
  }

  if (action === "remove" && amountOutside.includes(id)) {
    amountOutside = amountOutside.filter((value) => id !== value);
  }
}

export function initialiseAmountOutside() {
  amountOutside = [];
}
