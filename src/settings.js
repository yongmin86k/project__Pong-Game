export const SVG_NS  = 'http://www.w3.org/2000/svg';

export const GameOptions = {
    winningScore: 100,
}

// key setting for the player 1 and player 2
export const KEYS = {
    right: 'ArrowRight',
    left: 'ArrowLeft',
    a: 'a',        // player 1 up key
    z: 'z',        // player 1 down key
    up: 'ArrowUp',       // player 2 up key
    down: 'ArrowDown',     // player 2 down key
    spaceBar: ' ', // we'll use this later...
    enter: 'Enter',
  }

// properties of Paddle
export const PaddleOptions = {
    paddleWidth : 8,
    paddleHeight : 56,
    boardGap : 10,
    player1Color: '#FF0000',
    player2Color: '#00FFFF',
    speed: 10,
}

// properties of Ball
export const BallOptions = {
    number: 1,
    speed: 3, // must be larger than 0
    ballSize: [8, 12, 16, 24],
    ballColor: ['pink', 'cyan', 'yellow', 'yellowgreen']
}