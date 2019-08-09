import { SVG_NS, KEYS, PaddleOptions } from "../settings";

export default class Paddle {
    constructor(name, boardHeight, width, height, x, y, force = 0, color = '#FFFFFF', upKey, downKey) {
        this.name = name;
        this.boardHeight = boardHeight;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speed = PaddleOptions.speed;
        this.force = force;
        this.score = 0;
        this.color = color;
        this.upKey = upKey;
        this.downKey = downKey;

        this.keyState = {}; // update which keys are pressing

        document.addEventListener('keydown', event => {
            this.keyState[event.keyCode] = true;
        });
        document.addEventListener('keyup', event => {
            this.force = 0;
            this.keyState[event.keyCode] = false;
        });
    } // end of constructor

    up(){
        // move the paddle up but not above the top of the board
        const speed = this.speed + this.force;
        this.y = Math.max( this.y - speed, 0 );
        this.force += PaddleOptions.force;
    }

    down(){
        // move the paddle down but not more than the bottom of the board
        const speed = this.speed + this.force;
        this.y = Math.min( this.y + speed, (this.boardHeight - this.height) );
        this.force += PaddleOptions.force;
    }
    
    render(svg) {
        // smoothen movement of paddles
        if (this.keyState[KEYS.a] && this.upKey === KEYS.a ) {
            this.up();
        }
        if (this.keyState[KEYS.z] && this.downKey === KEYS.z ) {
            this.down();
        }
        if (this.keyState[KEYS.up] && this.upKey === KEYS.up ) {
            this.up();
        }
        if (this.keyState[KEYS.down] && this.downKey === KEYS.down ) {
            this.down();
        }

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

