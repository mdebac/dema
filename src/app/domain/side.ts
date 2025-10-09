export enum Side {
  LEFT="LEFT",
  RIGHT="RIGHT",
}

export const defaultSide: string = "RIGHT";
export function getValueByKeyForStringEnum(value: string) {
  return Object.entries(Side).find(([key, val]) => key === value)?.[1];
}

//https://www.technicalfeeder.com/2021/07/mastering-enum-in-typescript/
