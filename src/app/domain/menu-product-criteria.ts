// @ts-ignore
import {MenuProperty} from "./menu-property";
import {ProductType} from "./product-type";

// @ts-ignore
export interface MenuProductCriteria extends SearchCriteria {
  product: ProductType;
  menuProperties: MenuProperty[];
}
