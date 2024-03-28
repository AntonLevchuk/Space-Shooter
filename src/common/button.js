import { Text, TextStyle} from 'pixi.js'

let textPanel;

export const initButtonText = () => {   

    textPanel = new Text('Play Again');

    textPanel.style = new TextStyle({
        fontFamily: "Josefin Sans",
        fontSize: 36,
        fill: 0xFFFFFF,
    });

    textPanel.anchor.set(0.5)

    textPanel.interactive = true;
    textPanel.buttonMode = true;
    textPanel.cursor = 'pointer';

    textPanel.on('mouseover', onMouseOver);
    textPanel.on('mouseout', onMouseOut);

    return textPanel;
}

export const changeButtonText = (_text) => {
    textPanel.text = _text;
}

const onMouseOver = () => {
    textPanel.scale.set(1.2)
}

const onMouseOut = () => {
    textPanel.scale.set(1)
}