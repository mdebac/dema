import {Audit} from "./audit";
import {Chip} from "../../../pages/my-dashboard/chip.enum";
import {ApartmentItemIso} from "./apartment-item-iso";
import {ApartmentDetail} from "./apartment-detail";
import {Colors} from "./colors";

export interface ApartmentItem extends Audit{
  description: string;
  title: string;
  rowSpan: number;
  colSpan: number;
  cornerRadius: number;
  minHeight: number;
  backgroundColor: string;
  elevation: number;
  url: string;
  chip: Chip;
  apartmentDetailId: number;
  iso: ApartmentItemIso[];
  editorContent:string;

  //file data
  fileName: string;
  mimeType: string;
  size: number;
  image: any;
}


export interface ApartmentItemDialogData {
  languages: string[];
  item: Partial<ApartmentItem>;
  colors: Colors;
}
