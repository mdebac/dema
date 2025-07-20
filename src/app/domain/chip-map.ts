import {Chip} from "../../../pages/my-dashboard/chip.enum";
import {PictureComponent} from "../features/widget/type/picture/picture.component";
import {FormComponent} from "../features/widget/type/form/form.component";
import {TextComponent} from "../features/widget/type/text/text.component";
import {YoutubeComponent} from "../features/widget/type/video/youtube.component";
import {JobComponent} from "../features/widget/type/job/job.component";

export const ChipMap = new Map<Chip, any>([
  [Chip.TEXT, TextComponent],
  [Chip.JOB, JobComponent],
  [Chip.VIDEO, YoutubeComponent],
  [Chip.PICTURE, PictureComponent],
  [Chip.FORM, FormComponent]
])
