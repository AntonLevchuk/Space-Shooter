import { Container, Sprite, Graphics } from "pixi.js"
import { allTextureKeys } from '../common/textures'
import { getTexture } from "../common/assets"
import appConstants from "../common/constants"
import { addBullet } from "./bullets"

let boss;
let bossContainer;
let backgroundHealthBar;
let healthBar;

export let bossHp;

let timeout;

export const initBoss = () => {
    bossContainer = new Container();
    bossContainer.name = appConstants.containers.bossContainer;
    bossContainer.visible = false;

    return bossContainer;
}

export const addBoss = () => {
    boss = new Sprite(getTexture(allTextureKeys.shipBoss));
    boss.anchor.set(0.5, 1);
    boss.position.set(appConstants.size.WIDTH / 2, -250);
    boss.name = appConstants.containers.boss;
    boss.scale.set(0.7);
    boss.customData = {
        left: true,
        isAlive: true
    };

    bossHp = appConstants.amount.bossHp;

    bossContainer.addChild(boss);

    return boss;
}

export const addHealthBar = () => {
    
    backgroundHealthBar = new Graphics();
    backgroundHealthBar.beginFill(0x959595);
    backgroundHealthBar.drawRect(0, 0, boss.width, 8);
    backgroundHealthBar.endFill();
    backgroundHealthBar.pivot.set(backgroundHealthBar.width / 2);

    healthBar = new Graphics();
    healthBar.beginFill(0xff0000);
    healthBar.drawRect(0, 0, backgroundHealthBar.width, 8);
    healthBar.endFill();
    healthBar.pivot.set(backgroundHealthBar.width / 2);

    backgroundHealthBar.position.set(appConstants.size.WIDTH / 2, (boss.position.y - boss.height / 2 - 20));
    healthBar.position.set(appConstants.size.WIDTH / 2, (boss.position.y - boss.height / 2 - 20));

    backgroundHealthBar.customData = {
        left: true,
    };


    healthBar.customData = {
        left: true,
    };

    bossContainer.addChild(backgroundHealthBar);
    bossContainer.addChild(healthBar);
}

setInterval(() => {
    timeout = true;
}, 2000);

export const resetBoss = () => {
    bossContainer.removeChildren();
    addBoss();
    addHealthBar();
}

export const destroyBoss = () => {
    bossContainer.children.forEach((el) => {
        bossContainer.removeChild(el);
        el.destroy({children: true});
    });
}

export const bossTakeDamage = () => {
    if (bossHp > 0) {
        bossHp -= 1;
        let healthBarWidth = healthBar.width / appConstants.amount.bossHp * bossHp;
        healthBar.width = healthBarWidth;
    }
}

export const bossTick = () => {
    if (bossHp > 0) {
        bossContainer.visible = true;
        if (boss.position.y < 150) {
            boss.position.y += 0.5;
            backgroundHealthBar.position.y += 0.5;
            healthBar.position.y += 0.5;
        } else {
            bossContainer.children.forEach((el) => {
                let directionChanged = false;
                if (el.customData.left) {
                    el.position.x -= 1.5;
                    if (el.position.x < 60) {
                        el.customData.left = false;
                        directionChanged = true;
                    }
                } else {
                    el.position.x += 1.5;
                    if (el.position.x > appConstants.size.WIDTH - 60) {
                        el.customData.left = true;
                        directionChanged = true;
                    }
                }
                
                if (timeout) {
                    addBullet({x: el.position.x, y: el.position.y, width: el.width}, 0xd11427, false);
                    timeout = false;
                }
            });
        }
    }
}