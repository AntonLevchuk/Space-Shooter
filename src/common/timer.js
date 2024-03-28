import { TimerManager } from "eventemitter3-timer";
import { Text, TextStyle } from "pixi.js";
import appConstants from './constants'

let countdown = appConstants.timeValues.roundTime;
let countdownTxt = new Text(countdown);
let timerManager;
let timer;

export const initTimer = () => {

    timerManager = new TimerManager();

    timer = timerManager.createTimer(1000);
    timer.repeat = countdown;

    timer.on('start', elapsed => {
        timer.isFinish = false;
    });

    timer.on('end', elapsed => {
        countdownTxt.text = 'Round End';
        timer.isFinish = true;
    });

    timer.on('repeat', (elapsed, repeat) => {
        countdown --;
        countdownTxt.text = countdown;
    });

    return timer;
}

export const initCountDownTxt = () => {
    countdownTxt.style = new TextStyle({
        fontFamily: "Josefin Sans",
        fontSize: 24,
        fill : 0xffffff,
    });

    countdownTxt.anchor.set(0.5);

    return countdownTxt;
}

export const destroyTimer = (_timer) => {
    timerManager.removeTimer(_timer);
    countdown = appConstants.timeValues.roundTime;
    countdownTxt.text = countdown;
}