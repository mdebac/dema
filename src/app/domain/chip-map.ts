
import {Chip} from "./chip.enum";
import {TextComponent} from "../features/widget/type/text/text.component";
import {JobComponent} from "../features/widget/type/job/job.component";
import {YoutubeComponent} from "../features/widget/type/video/youtube.component";
import {PictureComponent} from "../features/widget/type/picture/picture.component";
import {ShoppingItemComponent} from "../features/widget/type/shopping-item/shopping-item.component";
import {FormComponent} from "../features/widget/type/form/form.component";
import {DomainsComponent} from "../features/widget/type/domains/domains.component";
import {HotelSearchComponent} from "../features/widget/type/hotel-search/hotel-search.component";
import {ShoppingCardComponent} from "../features/widget/type/shopping-card/shopping-card.component";

export const ChipMap = new Map<Chip, any>([
  [Chip.TEXT, TextComponent],
  [Chip.JOB, JobComponent],
  [Chip.HOTEL_SEARCH, HotelSearchComponent],
  [Chip.VIDEO, YoutubeComponent],
  [Chip.PICTURE, PictureComponent],
  [Chip.FORM, FormComponent],
  [Chip.SHOPPING_ITEM, ShoppingItemComponent],
  [Chip.SHOPPING_CARD, ShoppingCardComponent],
  [Chip.DOMAINS, DomainsComponent],
])
