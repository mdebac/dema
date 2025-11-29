export enum CountryIso {
  HR="Hrvatski",
  FR="Français",
  NL="Nederlands",
  DE="Deutsch",
  "GB-eng"="English",
  ES="Español",
  DK="Dansk",
  SE="Svenska",
  FI="Suomalainen",
  IT="Italiano",
  HU="Bhâsa Hongaria",
  PL="Polski",
  CZ="Čeština",
}

export const defaultIso: string = "GB-eng";
export function getIsoByKey(value: string) {
  return Object.entries(CountryIso).find(([key, val]) => key === value)?.[1];
}

//https://www.technicalfeeder.com/2021/07/mastering-enum-in-typescript/
