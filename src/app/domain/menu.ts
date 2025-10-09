import {MenuIso} from "./menu-iso";
import {Panel} from "./panel";
import {Audit} from "./audit";
import {Layout} from "./layout";
import {Side} from "./side";

export interface Menu extends Audit {
  mainId: number;
  menuUrl: string;

  layout: Layout; //center,full
  side: Side; //left,right
  hideMenuPanelIfOne: boolean;
  panelOn: boolean;

  orderNum: number;
  icon: string;
  iso: MenuIso [];
  panels: Panel[];
}
