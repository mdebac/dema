import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageSliderComponent } from './components/imageSlider/imageSlider.component';

@NgModule({
    imports: [CommonModule, ImageSliderComponent],
    exports: [ImageSliderComponent],
})
export class ImageSliderModule {}
