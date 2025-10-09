export enum Roles {
  ADMIN="Admin",
  MANAGER="Manager",
  USER="User",
}

export function getRolesByKeyForStringEnum(value: string) {
  return Object.entries(Roles).find(([key, val]) => key === value)?.[1];
}

export function getAllRoles() {
  return Object.entries(Roles).values();
}
//https://www.technicalfeeder.com/2021/07/mastering-enum-in-typescript/
