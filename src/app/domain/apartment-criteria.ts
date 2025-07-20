import {SearchCriteria} from "../../../util/search-criteria";
import {Chip} from "../../../pages/my-dashboard/chip.enum";

// @ts-ignore
export interface ApartmentCriteria extends SearchCriteria {
  // @ts-ignore
  chip?:Chip;
  // @ts-ignore
  title?:string;
}
