export interface Font {
    family: string;
}

export const font_families = new Map([
    ["funny", [
        'butcherman',
        'electrolize',
        'caesarDressing',
        'frederickatheGreat',
        'hennyPenny',
        'londrinaShadow',
        'megrim',
        'mysteryQuest',
        'onest',
        'pacifico',
        'robotoMono',
        'rubikVinyl',
        'rye',
        'tangerineB',
        'unifrakturMaguntia'
    ]],
    ["business", [
        'delius',
        'ewert',
        'fascinate',
        'jacquard24Charted',
        'monoton',
        'nosifer',
        'orbitron',
        'ribeyeMarrow',
        'rubikBeastly',
        'sixtyfour',
        'tangerine',
        'walterTurncoat',
        'zenDots'
    ]],
]);


export function allFonts() {
  const array2:string[][] = [];
    font_families.forEach((value: string[], key: string, map: Map<string, string[]>) => {
        array2.push(value)
    });
   return array2.flat(1);
}
