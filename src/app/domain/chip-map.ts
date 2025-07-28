
import {Chip} from "./chip.enum";
import {TextComponent} from "../features/widget/type/text/text.component";
import {JobComponent} from "../features/widget/type/job/job.component";
import {YoutubeComponent} from "../features/widget/type/video/youtube.component";
import {PictureComponent} from "../features/widget/type/picture/picture.component";
import {ShoppingComponent} from "../features/widget/type/shopping/shopping.component";
import {FormComponent} from "../features/widget/type/form/form.component";

export const ChipMap = new Map<Chip, any>([
  [Chip.TEXT, TextComponent],
  [Chip.JOB, JobComponent],
  [Chip.VIDEO, YoutubeComponent],
  [Chip.PICTURE, PictureComponent],
  [Chip.FORM, FormComponent],
  [Chip.SHOPPING, ShoppingComponent]
])
