import { SVG_NS } from "../settings";

export default class Paddle {
    constructor(boardHeight, width, height, x, y, color = '#FFFFFF', up, down) {
        this.boardHeight = boardHeight;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.score = 0;
        this.color = color;

        // add KeyListener
        document.addEventListener("keydown", event => {
            switch (event.key) {
                case up:
                    this.up();
                    console.log("up", this.y);
                    break;
                case down:
                    this.down();
                    console.log("down", this.y);
                    break;
            }
        });
    }

    up(){
        this.y = Math.max( this.y - this.speed, 0 );
    }

    down(){
        this.y = Math.min( this.y + this.speed, (this.boardHeight - this.height) );
    }
    
    render(svg) {
        // create SVG of rect
        let rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttributeNS(null, 'fill', this.color);
        rect.setAttributeNS(null, 'width', this.width);
        rect.setAttributeNS(null, 'height', this.height);
        rect.setAttributeNS(null, 'x', this.x);
        rect.setAttributeNS(null, 'y', this.y);

        // append SVG
        svg.appendChild(rect);
    }
}

