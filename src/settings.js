export const SVG_NS  = 'http://www.w3.org/2000/svg';

export const GameOptions = {
    winningScore: 10,
    intervalGameTime: 30, // unit is FPS
    displayGuideline: true,
}

// key setting for the player 1 and player 2
export const KEYS = {
    right: 39,              // ▶
    left: 37,               // ◀︎
    a: 65,                  // a
    z: 90,                  // z
    up: 38,                 // ▲
    down: 40,               // ▼
    spaceBar: 32,           // space
    enter: 13,              // enter
    ballFast: 70,           // f
    ballSlow: 86,           // v
    ballBig: 71,            // g
    ballSmall: 66,          // b
    ballPlus: 72,           // h
    ballMinus: 78,          // n
    toggleGuideline: 82,    // r
  }

// properties of Paddle
export const PaddleOptions = {
    paddleWidth : 8,
    paddleHeight : 72,
    paddleMinHeight : 32,
    boardGap : 10,
    player1Color: '#FF0000',
    player2Color: '#00FFFF',
    speed: 1.25,
    force: 0.25,
}

// properties of Ball
export const BallOptions = {
    number: 1,  // must be larger than 0 
                // must be same in Game.js reset section => BallOptions.number
    maxBallNum: 10,
    minBallNum: 1,
    speed: 3.5, // must be larger than 0 
                // must be same in Game.js reset section => BallOptions.speed
    minSpeed: 1,
    maxSpeed: 10,
    ballSize: [4, 10, 12, 14],
    maxBallsize: 56,
    minBallsize: 4, // must be larger than 0
    ballColor: ['rgba(240,240,240,0.8)', 'rgba(37,212,255,0.6)', 'rgba(255,252,37,0.6)', 'rgba(40,255,37,0.6)']
}