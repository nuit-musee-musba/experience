let amountPlaced: string[] = [];
export function hasRepaired(id: string) {
  if (!amountPlaced.includes(id)) {
    amountPlaced.push(id);
    if (amountPlaced.length >= 7) {
      console.log("weel done");

      return true;
    }
    return false;
  }
  return false;
}

export function initialiseAmountPlaced() {
  amountPlaced = [];
}
