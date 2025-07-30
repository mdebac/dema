export enum Roles {
  ADMIN="Admin",
  MANAGER="Manager",
  USER="User",
}

export function getRolesByKeyForStringEnum(value: string) {
  return Object.entries(Roles).find(([key, val]) => key === value)?.[1];
}

//https://www.technicalfeeder.com/2021/07/mastering-enum-in-typescript/
