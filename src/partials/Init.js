import { SVG_NS } from "../settings";

export default class Init {
    constructor(x, y, text, textSize = 20){
        this.x = x;
        this.y = y;
        this.text = text;
        this.textSize = textSize;
        this.animate = 0;
        this.limit = 32;
    }

    render(svg, selected){
        // flash the selected game option
        if ( selected && this.animate < this.limit ){
            this.color = 'white';
        } else if ( selected && (this.animate >= this.limit && this.animate < this.limit * 2)){
            this.color = 'transparent';
        } else if (this.animate >= this.limit * 2) {
            this.animate = 0;
        } else if (!selected){
            this.animate = 0;
            this.color = 'grey';
        };
        this.animate++;
        
        // renders svg texts
        let text = document.createElementNS(SVG_NS, 'text');

        text.setAttributeNS(null, 'x', this.x );
        text.setAttributeNS(null, 'y', this.y );
        text.setAttributeNS(null, 'font-family', `'Silkscreen Web', monotype`);
        text.setAttributeNS(null, 'font-size', this.textSize );
        text.setAttributeNS(null, 'fill', this.color);
        text.setAttributeNS(null, 'text-anchor', 'middle');
        text.setAttributeNS(null, 'cursor', 'pointer');
        text.textContent = this.text;

        svg.appendChild(text);
    }
}