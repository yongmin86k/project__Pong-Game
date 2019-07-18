import { SVG_NS, KEYS } from "../settings";
import Board from "./Board";
import Paddle from "./Paddle";

export default class Game {
  constructor(element, width, height) {
    this.element = element;
    this.width = width;
    this.height = height;

    // create SVG container
    this.gameElement = document.getElementById(this.element);
    
    // create new object for the board and net with same size of the SVG container
    this.board = new Board(this.width, this.height);

    // properties of Paddle
    this.paddleWidth = 8;
    this.paddleHeight = 56;
    this.boardGap = 10;

    // create new paddles for the each players
    this.player1 = new Paddle(
      this.height,
      this.paddleWidth,
      this.paddleHeight,
      this.boardGap,
      ((this.height - this.paddleHeight) / 2),
      '#FF0000',
      KEYS.a,
      KEYS.z,
    );
    this.player2 = new Paddle(
      this.height,
      this.paddleWidth,
      this.paddleHeight,
      this.width - (this.paddleWidth + this.boardGap),
      ((this.height - this.paddleHeight) / 2),
      '#00FFFF',
      KEYS.up,
      KEYS.down,
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
  }
}