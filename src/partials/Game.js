import Board from "./Board";
import Paddle from "./Paddle";
import Ball from "./Ball";
import { SVG_NS, KEYS, PaddleOptions, BallOptions } from "../settings";

export default class Game {
  constructor(element, width, height) {
    this.element = element;
    this.width = width;
    this.height = height;

    // create SVG container
    this.gameElement = document.getElementById(this.element);
    
    // create a new object for the board and net with same size of the SVG container
    this.board = new Board(this.width, this.height);

    // create new paddles for the each players
    this.player1 = new Paddle(
      this.height,
      PaddleOptions.paddleWidth,
      PaddleOptions.paddleHeight,
      PaddleOptions.boardGap,
      ((this.height - PaddleOptions.paddleHeight) / 2),
      PaddleOptions.player1Color,
      KEYS.a,
      KEYS.z,
    );
    this.player2 = new Paddle(
      this.height,
      PaddleOptions.paddleWidth,
      PaddleOptions.paddleHeight,
      this.width - (PaddleOptions.paddleWidth + PaddleOptions.boardGap),
      ((this.height - PaddleOptions.paddleHeight) / 2),
      PaddleOptions.player2Color,
      KEYS.up,
      KEYS.down,
    );

    // create a new ball for the game
    this.ball = new Ball(
      BallOptions.ballSize,
      BallOptions.ballColor,
      this.width,
      this.height
    );
  }

  render() {
    // properties for SVG tag
    this.gameElement.innerHTML = ''; // Clear the html before appending to fix a render bug 👾
    let svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttributeNS(null, "width", this.width);
    svg.setAttributeNS(null, "height", this.height);
    svg.setAttributeNS(null, "viewBox", [0, 0, this.width, this.height]);
    this.gameElement.appendChild(svg);

    // Render the board and net
    this.board.render(svg);

    // Render the paddles
    this.player1.render(svg);
    this.player2.render(svg);

    // Render the ball
    this.ball.render(svg);
  }
}