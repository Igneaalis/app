export const stringToBitmask = (inputString: string): number => {
  let bitmask = 0;
  for (let i = inputString.length - 1; i >= 0; i--) {
    const bit = +inputString[i];
    bitmask += bit * 2 ** (inputString.length - i - 1)
  }
  return bitmask;
}