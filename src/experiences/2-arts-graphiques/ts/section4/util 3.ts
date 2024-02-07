let amountPlaced: string[] = [];
export function hasRepaired(id: string) {
  if (!amountPlaced.includes(id)) {
    amountPlaced.push(id);
    if (amountPlaced.length >= 4) {
      console.log("weel done");

      return true;
    }
    return false;
  }
}

export function initialiseAmountPlaced() {
  amountPlaced = [];
}
