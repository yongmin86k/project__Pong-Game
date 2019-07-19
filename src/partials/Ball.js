import { SVG_NS } from "../settings";
import { basename } from "path";

export default class Ball {
    constructor(radius, color = '#FFFFFF', boardWidth, boardHeight) {
      this.radius = radius;
      this.color = color;
      this.boardWidth = boardWidth;
      this.boardHeight = boardHeight;
      this.direction = 1;

      this.reset();
    }

    reset(){
      this.x = this.boardWidth / 2;
      this.y = this.boardHeight / 2;
      
      this.vy = 0;
      while(this.vy === 0){  // this.vy won't show 0 output
        this.vy = Math.floor(Math.random() * 10 - 5);
      } 
      this.vx = this.direction * (6 - Math.abs(this.vy));
    }

    wallCollision(){
      const hitLeft = this.x - this.radius <= 0;
      const hitRight = this.x + this.radius >= this.boardWidth;
      const hitTop = this.y - this.radius <= 0;
      const hitBottom = this.y + this.radius >= this.boardHeight;
      if (hitLeft || hitRight ){ this.vx *= -1; } // this.vx = -this.vx;
      if (hitTop || hitBottom ){ this.vy *= -1; }
    }

    render(svg){
      // ball moves randomly when it resets
      this.x +=  this.vx;
      this.y += this.vy;

      this.wallCollision();

        let circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttributeNS(null, 'r', this.radius);
        circle.setAttributeNS(null, 'fill', this.color);
        circle.setAttributeNS(null, 'cx', this.x);
        circle.setAttributeNS(null, 'cy', this.y);

        svg.appendChild(circle);
    }
}