
import {Audit} from "./audit";
import {ApartmentItem} from "./apartment-item";
import {Colors} from "./colors";
import {Menu} from "./menu";
import {Panel} from "./panel";
import {Hosts} from "./hosts";
import {Language} from "./language";
import {Font} from "./font";

export interface ApartmentDetail extends Audit{

  columns:number;
  title:string;
  show:boolean;

  cornerRadius: number;
  cornerRadiusPanel: number;
  backgroundColor: string;


  items: ApartmentItem[];
 // iso: ApartmentDetailIso[];

  topMenu: Partial<Menu>;
  sideMenu: Partial<Panel>;
}

export interface ApartmentDetailDialogData {
  languages: Language[] | undefined;
  fonts: Font[] | undefined;
  detail: Partial<ApartmentDetail>;
  colors: Partial<Colors> | undefined;
  newMenuOrderNum: number;
  host: Hosts;
}
