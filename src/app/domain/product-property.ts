
import {Audit} from "./audit";

export interface ProductProperty extends Audit {
  name: string;
  type: string;
  unit:string;
  productId: number;
}
