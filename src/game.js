import * as PIXI from "pixi.js";
import { loadAssets } from "./common/assets";
import appConstants from "./common/constants";
import {
    bulletTick,
    destroyBullet,
    initBullets,
    destroyAllBullets,
} from "./sprites/bullets";
import {
    addPlayer,
    getPlayer,
    playerShoots,
    playerTick,
    playerShots,
    resetPlayerShots,
} from "./sprites/player";
import {
    initAsteroids,
    addAsteroid,
    asteroidsTick,
    destroyAsteroid,
    asteroidsLeft,
    resetAsteroids,
} from "./sprites/asteroids";
import { checkCollision } from "./common/utils";
import { initTextPanel, updateTextPanel } from "./common/textPanel";
import { initTimer, initCountDownTxt, destroyTimer } from "./common/timer";
import { initScene, changeTextOnScene } from "./common/gameOverScene";
import { initButtonText, changeButtonText } from "./common/button";
import {
    initBoss,
    addBoss,
    bossTick,
    resetBoss,
    addHealthBar,
    bossTakeDamage,
    bossHp,
    destroyBoss,
} from "./sprites/boss";

const WIDTH = appConstants.size.WIDTH;
const HEIGHT = appConstants.size.HEIGHT;
let playerHp = appConstants.amount.playerHp;

let keys = {
    Space: false,
    KeyA: false,
    KeyD: false,
};

const gameState = {
    stopped: false,
    moveLeftActive: false,
    moveRightActive: false,
};

let rootContainer;
let app;
let gameOverScene;
let gameSceneContainer;
let allBullets;
let playerBullets;
let bossBullets;
let timer;

let startBossRound = false;
let resetedValues = false;

let gameOverSceneNow = false;

const createScene = () => {
    app = new PIXI.Application({
        background: "#000000",
        antialias: true,
        width: WIDTH,
        height: HEIGHT,
    });
    document.body.appendChild(app.view);
    gameState.app = app;
    rootContainer = app.stage;
    gameSceneContainer = new PIXI.Container();

    rootContainer.addChild(gameSceneContainer);

    const textPanel = initTextPanel();
    gameSceneContainer.addChild(textPanel);

    initAndStartTimer();

    const countdownTxt = initCountDownTxt();
    gameSceneContainer.addChild(countdownTxt);
    countdownTxt.position.set(WIDTH / 2, HEIGHT - 20);

    gameOverScene = initScene().gameOverScene;
    rootContainer.addChild(gameOverScene);

    const textButton = initButtonText();
    textButton.position.set(WIDTH / 2, HEIGHT / 2 + 50);
    gameOverScene.addChild(textButton);
    textButton.on("pointerdown", restartGame);

    allBullets = initBullets(app, rootContainer);
    gameSceneContainer.addChild(allBullets);

    playerBullets = allBullets.getChildByName(
        appConstants.containers.playerBullets
    );
    gameSceneContainer.addChild(playerBullets);

    bossBullets = allBullets.getChildByName(
        appConstants.containers.bossBullets
    );
    gameSceneContainer.addChild(bossBullets);

    const player = addPlayer(app, rootContainer);
    gameSceneContainer.addChild(player);

    const asteroids = initAsteroids(app, rootContainer);
    addAsteroid();

    gameSceneContainer.addChild(asteroids);

    const bossContainer = initBoss();
    addBoss();
    addHealthBar();
    gameSceneContainer.addChild(bossContainer);

    return app;
};

const checkAllCollisions = () => {
    const asteroids = gameSceneContainer.getChildByName(
        appConstants.containers.asteroids
    );
    const playerBulets = gameSceneContainer.getChildByName(
        appConstants.containers.playerBullets
    );
    const bossBullets = gameSceneContainer.getChildByName(
        appConstants.containers.bossBullets
    );
    const boss = gameSceneContainer.getChildByName(
        appConstants.containers.bossContainer
    );
    const player = gameSceneContainer.getChildByName(
        appConstants.containers.player
    );
    if (asteroids && playerBulets) {
        iterateColisionElements(playerBulets, asteroids);
    }
    if (startBossRound) {
        if (bossBullets && playerBulets) {
            iterateColisionElements(bossBullets, playerBulets);
        }
        if (playerBulets && boss) {
            iterateColisionElements(boss, playerBulets);
        }
        if (bossBullets && player) {
            iterateColisionElements(bossBullets, player);
        }
    }
};

const initInteraction = () => {
    gameState.playerPosition = getPlayer().position.x;

    document.addEventListener("keydown", keysDown);
    document.addEventListener("keyup", keysUp);

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            playerShoots();
        }
    });

    gameState.app.ticker.add((delta) => {
        playerTick(gameState);
        heroMoving();
        bulletTick();
        asteroidsTick();
        if (startBossRound) {
            bossTick();
        }
        checkAllCollisions();
        timer.timerManager.update(app.ticker.elapsedMS);
        if (!gameOverSceneNow) {
            endRound();
        }
    });
};

const keysDown = (event) => {
    if (event.code in keys) {
        keys[event.code] = true;
    }
};

const keysUp = (event) => {
    if (event.code in keys) {
        keys[event.code] = false;
    }
};

const heroMoving = () => {
    if (keys["KeyA"] && gameState.playerPosition >= 40) {
        gameState.playerPosition -= 2.5;
    }

    if (keys["KeyD"] && gameState.playerPosition <= WIDTH - 40) {
        gameState.playerPosition += 2.5;
    }
};

const endRound = () => {
    if (
        startBossRound &&
        (playerHp <= 0 ||
            (playerShots >= appConstants.amount.playerBoolets &&
                playerBullets.children.length == 0))
    ) {
        changeScene(appConstants.text.looseRoundText);
        changeButtonText(appConstants.text.looseRoundButtonText);
    }
    if (
        timer.isFinish ||
        (asteroidsLeft > 0 &&
            playerShots >= appConstants.amount.playerBoolets &&
            playerBullets.children.length == 0)
    ) {
        changeScene(appConstants.text.looseRoundText);
        changeButtonText(appConstants.text.looseRoundButtonText);
    } else if (asteroidsLeft == 0) {
        if (!resetedValues) {
            resetedValues = true;
            destroyTimer(timer);
            resetPlayerShots();
            updateTextPanel(0);
            initAndStartTimer();
        }
        startBossRound = true;
        if (bossHp <= 0) {
            changeScene(appConstants.text.wonRoundText);
            destroyBoss();
            changeButtonText(appConstants.text.wonRoundButtonText);
        }
    }
};

const initAndStartTimer = () => {
    timer = initTimer();
    timer.start();
};

const changeScene = (_text = null) => {
    gameSceneContainer.visible = false;
    if (_text) {
        changeTextOnScene(_text);
    }
    gameOverScene.visible = true;
    gameOverSceneNow = true;
};

export const initGame = () => {
    loadAssets((progress) => {
        if (progress === "all") {
            createScene();
            initInteraction();
        }
    });
};

const resetScene = () => {
    gameOverScene.visible = false;
    gameSceneContainer.visible = true;
    gameOverSceneNow = false;
};

const iterateColisionElements = (_obj1, _obj2) => {
    if (_obj2.name == appConstants.containers.player) {
        _obj1.children.forEach((_j) => {
            if (
                _j.parent.name == appConstants.containers.bossBullets &&
                checkCollision(_j, _obj2)
            ) {
                destroyBullet(_j.name);
                playerHp -= 1;
            }
        });
    }
    _obj1.children.forEach((b) => {
        _obj2.children.forEach((a) => {
            if (checkCollision(b, a)) {
                if (
                    a.parent.name == appConstants.containers.asteroids &&
                    b.parent.name == appConstants.containers.playerBullets
                ) {
                    destroyAsteroid(a.name);
                    destroyBullet(b.name);
                } else if (
                    b.parent.name == appConstants.containers.asteroids &&
                    a.parent.name == appConstants.containers.playerBullets
                ) {
                    destroyAsteroid(b.name);
                    destroyBullet(a.name);
                } else if (
                    b.name == appConstants.containers.boss &&
                    a.parent.name == appConstants.containers.playerBullets
                ) {
                    bossTakeDamage();
                    destroyBullet(a.name);
                } else {
                    destroyBullet(b.name);
                    destroyBullet(a.name);
                }
            }
        });
    });
};

const restartGame = () => {
    startBossRound = false;
    resetedValues = false;
    playerHp = appConstants.amount.playerHp;
    resetScene();
    destroyTimer(timer);
    destroyAllBullets();
    resetBoss();
    resetAsteroids();
    resetPlayerShots();
    updateTextPanel(0);
    initAndStartTimer();
};
