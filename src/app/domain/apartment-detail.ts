import {Type} from "@angular/core";
import {Audit} from "./audit";
import {ApartmentItem} from "./apartment-item";
import {ApartmentDetailIso} from "./apartment-detail-iso";
import {Colors} from "./colors";

export interface ApartmentDetail extends Audit{

  columns:number;
  icon:string;
  title:string;
  label:string;
  show:boolean;
  titleUrl:string;
  mainId:number;

  items: ApartmentItem[];
  iso: ApartmentDetailIso[];
}

export interface ApartmentDetailDialogData {
  languages: string[] | undefined;
  detail: Partial<ApartmentDetail>;
  colors: Partial<Colors> | undefined;
  host: string | undefined;
}
