import {Audit} from "./audit";
import {ApartmentItemIso} from "./apartment-item-iso";
import {Colors} from "./colors";
import {Chip} from "./chip.enum";
import {Hosts} from "./hosts";
import {Language} from "./language";
import {Font} from "./font";

export interface ApartmentItem extends Audit{
  description: string;
  title: string;
  rowSpan: number;
  colSpan: number;
  cornerRadius: number;
  minHeight: number;
  backgroundColor: string;
  url: string;
  chip: Chip;
  detailId: number;
  iso: ApartmentItemIso[];
  editorContent:string;
  shadowColor: string;
  orderNum: number;
  //file data
  fileName: string;
  mimeType: string;
  size: number;
  image: any;
  imageWidth:number;
  imageHeight:number;
  imageAlignVertical: string;
  imageAlignHorizontal:string;

  beforeItemId:number;
  nextItemId:number;
  price: number | null;
}


export interface ApartmentItemDialogData {
  languages: Language[] | undefined | null;
  fonts: Font[] | undefined | null;
  item: Partial<ApartmentItem>;
  colors: Colors | null | undefined;
  roles: string[];
  host: Hosts | undefined;
  selectedIso: string;
}
