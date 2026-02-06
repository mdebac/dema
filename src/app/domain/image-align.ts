export enum ImageAlign {
    START="Start",
    CENTER="Center",
    END="End",
}

export const defaultImageAlign: ImageAlign = ImageAlign.START;
export function getImageAlignByKey(value: string) {
    return Object.entries(ImageAlign).find(([key, val]) => key === value)?.[1];
}
export const imageAlignTypes = Object.values(ImageAlign);
