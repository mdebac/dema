
import {Audit} from "./audit";
import {ApartmentItem} from "./apartment-item";
import {ApartmentDetailIso} from "./apartment-detail-iso";
import {Colors} from "./colors";
import {Menu} from "./menu";
import {Panel} from "./panel";

export interface ApartmentDetail extends Audit{

  columns:number;
  title:string;
  show:boolean;

  cornerRadius: number;
  cornerRadiusPanel: number;
  backgroundColor: string;


  items: ApartmentItem[];
  iso: ApartmentDetailIso[];

  topMenu: Partial<Menu>;
  sideMenu: Partial<Panel>;
}

export interface ApartmentDetailDialogData {
  languages: string[] | undefined;
  detail: Partial<ApartmentDetail>;
  colors: Partial<Colors> | undefined;
  newMenuOrderNum: number;
}
