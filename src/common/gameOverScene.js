import { Container } from "pixi.js"
import { Text, TextStyle } from "pixi.js";
import appConstants from './constants'

let gameOverScene;
let sceneText;

export const initScene = () => {
    gameOverScene = new Container();
    gameOverScene.visible = false;

    sceneText = new Text('');
    sceneText.style = new TextStyle({
        fontFamily: "Josefin Sans",
        fontSize: 64,
        fill: "white",
    });
    sceneText.anchor.set(0.5);
    sceneText.position.set(appConstants.size.WIDTH / 2, appConstants.size.HEIGHT / 2);

    gameOverScene.addChild(sceneText);

    return {gameOverScene: gameOverScene, sceneText: sceneText};
}

export const changeTextOnScene = (_text) => {
    sceneText.text = _text;
}