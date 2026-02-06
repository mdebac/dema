
import {Audit} from "./audit";
import {ProductProperty} from "./product-property";
import {MatTableDataSource} from "@angular/material/table";

export interface ProductType extends Audit {
  name: string;
  image: any;
  mainId: number;
  properties: Partial<ProductProperty>[];
  propertyDS?: MatTableDataSource<Partial<ProductProperty>>;
}
