import {Type} from "@angular/core";
import {ApartmentItem} from "../../domain/apartment-item";
import {Colors} from "../../domain/colors";
import {Hosts} from "../../domain/hosts";
import {Language} from "../../domain/language";
import {Font} from "../../domain/font";

export interface Widget {
  item: ApartmentItem | null,
  languages:Language[] | null | undefined,
  fonts:Font[] | null | undefined,
  component: Type<unknown> | null
  colors: Colors | undefined,
  host: Hosts | undefined,
}
