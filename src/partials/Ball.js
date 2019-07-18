import { SVG_NS } from "../settings";

export default class Ball {
    constructor(radius, color, boardWidth, boardHeight) {
      this.radius = radius;
      this.color = color;
      this.boardWidth = boardWidth;
      this.boardHeight = boardHeight;
      this.direction = 1;
    }

    render(svg){
        let circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttributeNS(null, 'fill', this.color);
        circle.setAttributeNS(null, 'r', this.radius);
        circle.setAttributeNS(null, 'cx', this.boardWidth / 2);
        circle.setAttributeNS(null, 'cy', this.boardHeight / 2);

        svg.appendChild(circle);
    }
}