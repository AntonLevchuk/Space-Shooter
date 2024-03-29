import {Sprite} from 'pixi.js'
import { getTexture } from '../common/assets'
import appConstants from '../common/constants'
import { allTextureKeys } from '../common/textures'
import { addBullet } from './bullets'
import { updateTextPanel } from '../common/textPanel'

let player;
let app;
export let playerShots = 0;

export const addPlayer = (currApp, root) => {
    if(player){
        return player
    }
    app = currApp
    player = new Sprite(getTexture(allTextureKeys.spaceShip))
    player.name = appConstants.containers.player;
    player.anchor.set(0.5, 1);
    player.scale.set(0.3);
    player.position.x = appConstants.size.WIDTH / 2;
    player.position.y = appConstants.size.HEIGHT - 35;
    return player;
}

export const getPlayer = () => player;

export const playerShoots = () => {
    if (playerShots < appConstants.amount.playerBoolets) {
        addBullet({x: player.position.x, y: player.position.y, width: player.width})
        playerShots++;
        updateTextPanel(playerShots);
    } else {
        console.log('No Ammo')
    }
}

export const resetPlayerShots = () => {
    playerShots = 0
};

export const playerTick = (state) => {
    const playerPosition = player.position.x

    player.position.x = state.playerPosition

    if(player.position.x < playerPosition) {
        player.rotation = -0.3
    } else if(player.position.x > playerPosition){
        player.rotation = 0.3
    } else {
        player.rotation = 0
    }
}