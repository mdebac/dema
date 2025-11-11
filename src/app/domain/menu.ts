import {MenuIso} from "./menu-iso";
import {Panel} from "./panel";
import {Audit} from "./audit";
import {Layout} from "./layout";
import {Side} from "./side";

export interface Menu extends Audit {
  mainId: number;
  menuUrl: string;
  image: File | null;
  removeImage: boolean;

  layout: Layout; //center,full
  side: Side; //left,right
  hideMenuPanelIfOne: boolean;
  panelOn: boolean;
  searchOn: boolean;

  orderNum: number;
  icon: string;
  iso: MenuIso [];
  panels: Panel[];
}
