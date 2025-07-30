import {Type} from "@angular/core";
import {ApartmentItem} from "../../domain/apartment-item";
import {Colors} from "../../domain/colors";

export interface Widget {
  item: ApartmentItem | null,
  languages:string[] | null,
  component: Type<unknown> | null
  colors: Colors | undefined,
}
