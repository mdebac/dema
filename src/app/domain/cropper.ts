import {OutputFormat} from "ngx-image-cropper";

export abstract class Cropper {

    itemFile: any = "";
    cropWidth: number | undefined = undefined;
    cropQuality = 60;
    cropHeight: number | undefined = undefined
    cropType = 'jpeg';
    keepAspectRatio = false;

    //CROPPING
    getFormat(ext: "png" | "jpeg" | "bmp" | "webp" | "ico" | undefined) {

        if (this.cropType === '*') {
          //  console.log("getFormat1",ext + '' as OutputFormat);
            return ext + '' as OutputFormat;
        } else {
          //  console.log("getFormat2",this.cropType as OutputFormat);
            return this.cropType as OutputFormat;
        }
        // return ext + '' as OutputFormat;
    }

    getAspectRatio() {
        if (this.cropWidth && this.cropHeight) {
            this.keepAspectRatio = true;
            // tslint:disable-next-line: radix
            //  return parseInt(this.cropWidth) / parseInt(this.cropHeight);
            return this.cropWidth / this.cropHeight;
        } else {
            return 1;
        }
    }

    getBackgroundColor(item: any | null | undefined) {
        let color: string | undefined = undefined;
        if (this.cropType === 'png') {
            color = undefined;
        } else {
            if (this.cropType === '*' && item.type.indexOf('png') !== -1) {
                color = undefined;
            }
        }
        return color;
    }


    getFilenameExtension(file: any) {
        let ex = file.name.split('.').pop();
        if (ex === 'jpg') ex = 'jpeg';
     //   console.log("getFilenameExtension", ex);
        return ex;
    }

}
