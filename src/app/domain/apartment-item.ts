import {Audit} from "./audit";
import {ApartmentItemIso} from "./apartment-item-iso";
import {Colors} from "./colors";
import {Chip} from "./chip.enum";

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
  detailId: number;
  iso: ApartmentItemIso[];
  editorContent:string;

  //file data
  fileName: string;
  mimeType: string;
  size: number;
  image: any;
}


export interface ApartmentItemDialogData {
  languages: string[] | undefined | null;
  item: Partial<ApartmentItem>;
  colors: Colors | null | undefined;
}
