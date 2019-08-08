export const SVG_NS  = 'http://www.w3.org/2000/svg';

export const GameOptions = {
    winningScore: 10,
    intervalGameTime: 30, // unit is FPS
}

// key setting for the player 1 and player 2
export const KEYS = {
    right: 39,
    left: 37,
    a: 65,        
    z: 90,        
    up: 38, 
    down: 40,
    spaceBar: 32,
    enter: 13,
    ballFast: 70,
    ballSlow: 86,
    ballBig: 71,
    ballSmall: 66,
    ballPlus: 72,
    ballMinus: 78,
  }

// properties of Paddle
export const PaddleOptions = {
    paddleWidth : 8,
    paddleHeight : 88,
    paddleMinHeight : 16,
    boardGap : 10,
    player1Color: '#FF0000',
    player2Color: '#00FFFF',
    speed: 5,
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
    ballSize: [8, 10, 12, 14],
    maxBallsize: 56,
    minBallsize: 4, // must be larger than 0
    ballColor: ['rgba(240,240,240,0.8)', 'rgba(37,212,255,0.6)', 'rgba(255,252,37,0.6)', 'rgba(40,255,37,0.6)']
}