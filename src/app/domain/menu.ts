import {MenuIso} from "./menu-iso";
import {Panel} from "./panel";
import {Audit} from "./audit";
import {Layout} from "./layout";
import {Side} from "./side";
import {Chip} from "./chip.enum";
import {TopMenuType} from "./top-menu-type";
import {MenuProperty} from "./menu-property";

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

  productId:number;
  orderNum: number;
  beforeId: number;
  nextId: number;
  chip: Chip

  icon: string;
  iso: MenuIso [];
  properties: MenuProperty[];
  panels: Panel[];
  type: TopMenuType;
  price: number | null;
}
