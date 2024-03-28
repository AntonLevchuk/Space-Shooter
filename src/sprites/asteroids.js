import { Container, Sprite } from 'pixi.js'
import { getTexture } from '../common/assets'
import appConstants from '../common/constants'
import { allTextureKeys } from '../common/textures'
import { randomIntFromInterval, randomFloatFromInterval } from '../common/utils'

let app;
let rootContainer;
let asteroids;

export let asteroidsLeft = appConstants.amount.asteroidsAmount;

export const initAsteroids = (currApp, root) => {
    asteroids = new Container();
    asteroids.name = appConstants.containers.asteroids;
    app = currApp;
    rootContainer = root;
    return asteroids;
}

export const addAsteroid = () => {
    for (let i = 0; i < appConstants.amount.asteroidsAmount; i++) {
        const asteroid = new Sprite(getTexture(allTextureKeys.asteroid));
        asteroid.anchor.set(0.5, 1);
        asteroid.scale.set(0.1);
        asteroid.name = i;
        asteroid.speed = randomFloatFromInterval(0.5, 1.5);
        setPositionForASteroid(asteroid);
        
        asteroids.addChild(asteroid);
    }
}

export const destroyAsteroid = (_asteroidName) => {
    let _asteroid;
    if (asteroids.getChildByName(_asteroidName)) {
        _asteroid = asteroids.getChildByName(_asteroidName);
        asteroidsLeft -= 1;
        asteroids.removeChild(_asteroid);
        _asteroid.destroy({children: true});
    }
}

export const resetAsteroids = () => {
    asteroids.removeChildren();
    asteroidsLeft = appConstants.amount.asteroidsAmount;
    addAsteroid();
}

export const respawnAsteroid = (_asteroid) => {
    if ((_asteroid.position.y - _asteroid.height) >= appConstants.size.HEIGHT) {
        setPositionForASteroid(_asteroid);
    }
}

const setPositionForASteroid = (_asteroid) => {
    _asteroid.position.x = randomIntFromInterval(_asteroid.width, appConstants.size.WIDTH - _asteroid.width);
    _asteroid.position.y = randomIntFromInterval(0, -2500);
}

export const asteroidsTick = () => {
    asteroids.children.forEach((el) => {
        el.position.y += el.speed;
        respawnAsteroid(el);
    });
}