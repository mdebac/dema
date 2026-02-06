import {ApartmentItem} from "../apartment-item";
import {Menu} from "../menu";

export class CartItem {

    id: number = 0;
    name: string = "";
    imageUrl: string;
    unitPrice: number = 0;
    quantity: number;

    constructor(product: Partial<ApartmentItem> | Partial<Menu>, selectedIso: string) {
        if(product.id){
            this.id = product.id;
        }
        if(product.iso){
            const title = product.iso.find(i => i.iso === selectedIso)?.title;
            if(title){
                this.name = title;
            }
        }
        this.imageUrl = product.image;
        if(product.price){
            this.unitPrice = product.price;
        }

        this.quantity = 1;
    }
}
