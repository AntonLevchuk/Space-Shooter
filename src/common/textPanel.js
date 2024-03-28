import { Text, TextStyle } from "pixi.js";

let score;
let textPanel;
export const initTextPanel = () => {
    score = 10;
    textPanel = new Text('Bullets: ' + score);

    textPanel.style = new TextStyle({
        fontFamily: "Josefin Sans",
        fontSize: 36,
        fill: 0xFFFFFF,
    });
    return textPanel;
}

export const updateTextPanel = (_shootsMade) => {
    textPanel.text = 'Bullets: ' + (score - _shootsMade);
}