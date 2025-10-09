export enum Layout {
  CENTER="CENTER",
  FULL="FULL",
  // PANEL_RIGHT="PANEL_RIGHT",
  // PANEL_LEFT="PANEL_LEFT",
  // NO_PANEL="NO_PANEL",
}

export const defaultLayout: string = "CENTER";
export function getValueByKeyForStringEnum(value: string) {
  return Object.entries(Layout).find(([key, val]) => key === value)?.[1];
}

//https://www.technicalfeeder.com/2021/07/mastering-enum-in-typescript/

export const layoutMap = new Map([
  ["0,0,0,0,0", {gapL: 1, panelL: 0, menuL: 4, center: 14, menuR: 0, panelR: 0, gapR: 1}],
  ["0,0,0,0,1", {gapL: 2, panelL: 0, menuL: 1, center: 15, menuR: 0, panelR: 0, gapR: 2}],
  ["0,0,0,1,0", {gapL: 1, panelL: 0, menuL: 4, center: 10, menuR: 0, panelR: 4, gapR: 1}],
  ["0,0,0,1,1", {gapL: 1, panelL: 0, menuL: 1, center: 13, menuR: 0, panelR: 4, gapR: 1}],
  ["0,0,1,0,0", {gapL: 1, panelL: 0, menuL: 0, center: 18, menuR: 0, panelR: 0, gapR: 1}],
  ["0,0,1,0,1", {gapL: 1, panelL: 0, menuL: 0, center: 18, menuR: 0, panelR: 0, gapR: 1}],
  ["0,0,1,1,0", {gapL: 1, panelL: 0, menuL: 0, center: 14, menuR: 0, panelR: 4, gapR: 1}],
  ["0,0,1,1,1", {gapL: 1, panelL: 0, menuL: 0, center: 14, menuR: 0, panelR: 4, gapR: 1}],
  ["0,1,0,0,0", {gapL: 0, panelL: 0, menuL: 4, center: 16, menuR: 0, panelR: 0, gapR: 0}],
  ["0,1,0,0,1", {gapL: 0, panelL: 0, menuL: 1, center: 19, menuR: 0, panelR: 0, gapR: 0}],
  ["0,1,0,1,0", {gapL: 0, panelL: 0, menuL: 4, center: 12, menuR: 0, panelR: 4, gapR: 0}],
  ["0,1,0,1,1", {gapL: 0, panelL: 0, menuL: 1, center: 15, menuR: 0, panelR: 4, gapR: 0}],
  ["0,1,1,0,0", {gapL: 0, panelL: 0, menuL: 0, center: 20, menuR: 0, panelR: 0, gapR: 0}],
  ["0,1,1,0,1", {gapL: 0, panelL: 0, menuL: 0, center: 20, menuR: 0, panelR: 0, gapR: 0}],
  ["0,1,1,1,0", {gapL: 0, panelL: 0, menuL: 0, center: 16, menuR: 0, panelR: 4, gapR: 0}],
  ["0,1,1,1,1", {gapL: 0, panelL: 0, menuL: 0, center: 16, menuR: 0, panelR: 4, gapR: 0}],
  ["1,0,0,0,0", {gapL: 1, panelL: 0, menuL: 0, center: 14, menuR: 4, panelR: 0, gapR: 1}],
  ["1,0,0,0,1", {gapL: 2, panelL: 0, menuL: 0, center: 15, menuR: 1, panelR: 0, gapR: 2}],
  ["1,0,0,1,0", {gapL: 1, panelL: 4, menuL: 0, center: 10, menuR: 4, panelR: 0, gapR: 1}],
  ["1,0,0,1,1", {gapL: 1, panelL: 4, menuL: 0, center: 13, menuR: 1, panelR: 0, gapR: 1}],
  ["1,0,1,0,0", {gapL: 1, panelL: 0, menuL: 0, center: 18, menuR: 0, panelR: 0, gapR: 1}],
  ["1,0,1,0,1", {gapL: 1, panelL: 0, menuL: 0, center: 18, menuR: 0, panelR: 0, gapR: 1}],
  ["1,0,1,1,0", {gapL: 1, panelL: 4, menuL: 0, center: 14, menuR: 0, panelR: 0, gapR: 1}],
  ["1,0,1,1,1", {gapL: 1, panelL: 4, menuL: 0, center: 14, menuR: 0, panelR: 0, gapR: 1}],
  ["1,1,0,0,0", {gapL: 0, panelL: 0, menuL: 0, center: 16, menuR: 4, panelR: 0, gapR: 0}],
  ["1,1,0,0,1", {gapL: 0, panelL: 0, menuL: 0, center: 19, menuR: 1, panelR: 0, gapR: 0}],
  ["1,1,0,1,0", {gapL: 0, panelL: 4, menuL: 0, center: 12, menuR: 4, panelR: 0, gapR: 0}],
  ["1,1,0,1,1", {gapL: 0, panelL: 4, menuL: 0, center: 15, menuR: 1, panelR: 0, gapR: 0}],
  ["1,1,1,0,0", {gapL: 0, panelL: 0, menuL: 0, center: 20, menuR: 0, panelR: 0, gapR: 0}],
  ["1,1,1,0,1", {gapL: 0, panelL: 0, menuL: 0, center: 20, menuR: 0, panelR: 0, gapR: 0}],
  ["1,1,1,1,0", {gapL: 0, panelL: 4, menuL: 0, center: 16, menuR: 0, panelR: 0, gapR: 0}],
  ["1,1,1,1,1", {gapL: 0, panelL: 4, menuL: 0, center: 16, menuR: 0, panelR: 0, gapR: 0}],
]);
