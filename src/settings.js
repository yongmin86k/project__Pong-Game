export const SVG_NS  = 'http://www.w3.org/2000/svg';

// key setting for the player 1 and player 2
export const KEYS = {
    a: 'a',        // player 1 up key
    z: 'z',        // player 1 down key
    up: 'ArrowUp',       // player 2 up key
    down: 'ArrowDown',     // player 2 down key
    spaceBar: ' ', // we'll use this later...
  }

// properties of Paddle
export const PaddleOptions = {
    paddleWidth : 8,
    paddleHeight : 56,
    boardGap : 10,
    player1Color: '#FF0000',
    player2Color: '#00FFFF',
}

// properties of Ball
export const BallOptions = {
    ballSize: 8,
    ballColor: '#FFFFFF'
}