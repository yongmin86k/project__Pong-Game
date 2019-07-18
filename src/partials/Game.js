import { SVG_NS } from "../settings";
import Board from "./Board";

export default class Game {
  constructor(element, width, height) {
    this.element = element;
    this.width = width;
    this.height = height;

    // create SVG tag
    this.gameElement = document.getElementById(this.element);
    this.board = new Board(this.width, this.height);
  }

  render() {
    // properties for SVG tag
    this.gameElement.innerHTML = ''; // Clear the html before appending to fix a render bug 👾
    let svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttributeNS(null, "width", this.width);
    svg.setAttributeNS(null, "height", this.height);
    svg.setAttributeNS(null, "viewBox", `0 0 ${this.width} ${this.height}`);
    this.gameElement.appendChild(svg);

    // Render the board and net
    this.board.render(svg);
  }
}