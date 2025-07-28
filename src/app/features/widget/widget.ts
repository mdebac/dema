import {Type} from "@angular/core";
import {ApartmentItem} from "../../domain/apartment-item";
import {Colors} from "../../domain/colors";

export interface Widget {
  item: ApartmentItem,
  languages:string[],
  component: Type<unknown>
  colors: Colors,
}
