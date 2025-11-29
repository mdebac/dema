export enum Layout {
  CENTER="CENTER",
  FULL="FULL",
}

export const layoutMap = new Map([
  ["0,0,0,0,0", {gapL: 1, panelL: 0, menuL: 5, center: 13, menuR: 0, panelR: 0, gapR: 1}],
  ["0,0,0,0,1", {gapL: 2, panelL: 0, menuL: 2, center: 14, menuR: 0, panelR: 0, gapR: 2}],//menuL 1->2
  ["0,0,0,1,0", {gapL: 1, panelL: 0, menuL: 5, center: 9, menuR: 0, panelR: 4, gapR: 1}],
  ["0,0,0,1,1", {gapL: 1, panelL: 0, menuL: 2, center: 12, menuR: 0, panelR: 4, gapR: 1}],//menuL 1->2
  ["0,0,1,0,0", {gapL: 1, panelL: 0, menuL: 0, center: 18, menuR: 0, panelR: 0, gapR: 1}],
  ["0,0,1,0,1", {gapL: 1, panelL: 0, menuL: 0, center: 18, menuR: 0, panelR: 0, gapR: 1}],
  ["0,0,1,1,0", {gapL: 1, panelL: 0, menuL: 0, center: 14, menuR: 0, panelR: 4, gapR: 1}],
  ["0,0,1,1,1", {gapL: 1, panelL: 0, menuL: 0, center: 14, menuR: 0, panelR: 4, gapR: 1}],
  ["0,1,0,0,0", {gapL: 0, panelL: 0, menuL: 5, center: 15, menuR: 0, panelR: 0, gapR: 0}],
  ["0,1,0,0,1", {gapL: 0, panelL: 0, menuL: 2, center: 18, menuR: 0, panelR: 0, gapR: 0}],//menuL 1->2
  ["0,1,0,1,0", {gapL: 0, panelL: 0, menuL: 5, center: 11, menuR: 0, panelR: 4, gapR: 0}],
  ["0,1,0,1,1", {gapL: 0, panelL: 0, menuL: 2, center: 14, menuR: 0, panelR: 4, gapR: 0}],//menuL 1->2
  ["0,1,1,0,0", {gapL: 0, panelL: 0, menuL: 0, center: 20, menuR: 0, panelR: 0, gapR: 0}],
  ["0,1,1,0,1", {gapL: 0, panelL: 0, menuL: 0, center: 20, menuR: 0, panelR: 0, gapR: 0}],
  ["0,1,1,1,0", {gapL: 0, panelL: 0, menuL: 0, center: 16, menuR: 0, panelR: 4, gapR: 0}],
  ["0,1,1,1,1", {gapL: 0, panelL: 0, menuL: 0, center: 16, menuR: 0, panelR: 4, gapR: 0}],
  ["1,0,0,0,0", {gapL: 1, panelL: 0, menuL: 0, center: 13, menuR: 5, panelR: 0, gapR: 1}],
  ["1,0,0,0,1", {gapL: 2, panelL: 0, menuL: 0, center: 14, menuR: 2, panelR: 0, gapR: 2}],
  ["1,0,0,1,0", {gapL: 1, panelL: 4, menuL: 0, center: 9, menuR: 5, panelR: 0, gapR: 1}],
  ["1,0,0,1,1", {gapL: 1, panelL: 4, menuL: 0, center: 12, menuR: 2, panelR: 0, gapR: 1}],
  ["1,0,1,0,0", {gapL: 1, panelL: 0, menuL: 0, center: 18, menuR: 0, panelR: 0, gapR: 1}],
  ["1,0,1,0,1", {gapL: 1, panelL: 0, menuL: 0, center: 18, menuR: 0, panelR: 0, gapR: 1}],
  ["1,0,1,1,0", {gapL: 1, panelL: 4, menuL: 0, center: 14, menuR: 0, panelR: 0, gapR: 1}],
  ["1,0,1,1,1", {gapL: 1, panelL: 4, menuL: 0, center: 14, menuR: 0, panelR: 0, gapR: 1}],
  ["1,1,0,0,0", {gapL: 0, panelL: 0, menuL: 0, center: 15, menuR: 5, panelR: 0, gapR: 0}],
  ["1,1,0,0,1", {gapL: 0, panelL: 0, menuL: 0, center: 18, menuR: 2, panelR: 0, gapR: 0}],
  ["1,1,0,1,0", {gapL: 0, panelL: 4, menuL: 0, center: 11, menuR: 5, panelR: 0, gapR: 0}],
  ["1,1,0,1,1", {gapL: 0, panelL: 4, menuL: 0, center: 14, menuR: 2, panelR: 0, gapR: 0}],
  ["1,1,1,0,0", {gapL: 0, panelL: 0, menuL: 0, center: 20, menuR: 0, panelR: 0, gapR: 0}],
  ["1,1,1,0,1", {gapL: 0, panelL: 0, menuL: 0, center: 20, menuR: 0, panelR: 0, gapR: 0}],
  ["1,1,1,1,0", {gapL: 0, panelL: 4, menuL: 0, center: 16, menuR: 0, panelR: 0, gapR: 0}],
  ["1,1,1,1,1", {gapL: 0, panelL: 4, menuL: 0, center: 16, menuR: 0, panelR: 0, gapR: 0}],
]);
