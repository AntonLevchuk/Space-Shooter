const appConstants = {
    size: {
        WIDTH: 1280,
        HEIGHT: 720,
    },
    containers: {
        player: "player",
        allBullets: "allBullets",
        playerBullets: "playerBullets",
        bossBullets: "bossBullets",
        asteroids: "asteroids",
        bossContainer: "bossContainer",
        boss: "boss",
    },
    probability: {
        bossChangeDirection: 20,
    },
    timeValues: {
        roundTime: 60,
        bossShotTimeout: 2000,
    },
    amount: {
        playerBoolets: 10,
        asteroidsAmount: 10,
        bulletSpeed: 1,
        bossHp: 4,
        playerHp: 1,
    },
    text: {
        looseRoundText: "YOU LOSE",
        wonRoundText: "YOU WIN",
        looseRoundButtonText: "Try Again",
        wonRoundButtonText: "Play Again",
        bossFightText: "Boss Fight",
    },
};

export default appConstants;
