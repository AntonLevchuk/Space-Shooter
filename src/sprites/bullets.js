import { Container, Graphics } from "pixi.js";
import appConstants from "../common/constants";

let app;
let allBullets;
let playerBullets;
let bossBullets;

let bulletIndex = 0;

const bulletSpeed = appConstants.amount.bulletSpeed;

export const initBullets = (currApp, root) => {
    allBullets = new Container();
    playerBullets = new Container();
    bossBullets = new Container();

    allBullets.name = appConstants.containers.allBullets;
    playerBullets.name = appConstants.containers.playerBullets;
    bossBullets.name = appConstants.containers.bossBullets;
    app = currApp;

    allBullets.addChild(playerBullets);
    allBullets.addChild(bossBullets);

    return allBullets;
};

export const addBullet = (data, _colour = 0x66ccff, _playerBoolet = true) => {
    let rectangle = new Graphics();

    rectangle.beginFill(_colour);
    rectangle.drawRect(0, 0, 8, 15);
    rectangle.endFill();
    rectangle.pivot.set(rectangle.width / 2);
    rectangle.x = data.x;
    rectangle.name = bulletIndex;

    rectangle.y = data.y - rectangle.height;
    if (_playerBoolet) {
        playerBullets.addChild(rectangle);
    } else {
        bossBullets.addChild(rectangle);
    }
    bulletIndex++;
};

export const destroyBullet = (bulletName) => {
    let bullet;
    if (playerBullets.getChildByName(bulletName)) {
        bullet = playerBullets.getChildByName(bulletName);
        playerBullets.removeChild(bullet);
        bullet.destroy({ children: true });
    } else if (bossBullets.getChildByName(bulletName)) {
        bullet = bossBullets.getChildByName(bulletName);
        bossBullets.removeChild(bullet);
        bullet.destroy({ children: true });
    }
};

export const destroyAllBullets = () => {
    playerBullets.children.forEach((_pBullet) => {
        destroyBullet(_pBullet.name);
    });
    bossBullets.children.forEach((_bBullet) => {
        destroyBullet(_bBullet.name);
    });
};

export const bulletTick = () => {
    playerBullets.children.forEach((pb) => {
        if (!pb._destroyed && pb.position.y <= 0) {
            destroyBullet(pb.name);
        }
        if (!pb._destroyed) {
            pb.position.y -= bulletSpeed * 2;
        }
    });

    bossBullets.children.forEach((bb) => {
        if (!bb._destroyed && bb.position.y >= appConstants.size.HEIGHT) {
            destroyBullet(bb.name);
        }
        if (!bb._destroyed) {
            bb.position.y += bulletSpeed * 2;
        }
    });
};
