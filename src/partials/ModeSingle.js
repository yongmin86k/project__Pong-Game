import { SVG_NS, KEYS } from "../settings";

export default class ModeSingle {
    constructor(boardWidth, boardHeight){
        this.x = boardWidth / 2;
        this.y = (boardHeight / 2) - 40;
        this.animate = 0;
        this.limit = 16;
    }

    render(svg){
        let text = document.createElementNS(SVG_NS, 'text');
        let tspan = document.createElementNS(SVG_NS, 'tspan');
        let tspan2 = document.createElementNS(SVG_NS, 'tspan');
        text.setAttributeNS(null, 'x', this.x);
        text.setAttributeNS(null, 'y', this.y);
        text.setAttributeNS(null, 'fill', '#FFFFFF');
        text.setAttributeNS(null, 'text-anchor', 'middle');
        text.setAttributeNS(null, 'fill', '#FFFFFF');
        text.setAttributeNS(null, 'font-family', `'Silkscreen Web', monotype`);
        text.setAttributeNS(null, 'font-size', 32 );

        tspan.setAttributeNS(null, 'x', this.x);
        tspan.setAttributeNS(null, 'y', this.y + 32);
        tspan.setAttributeNS(null, 'font-size', 20 );

        tspan2.setAttributeNS(null, 'x', this.x);
        tspan2.setAttributeNS(null, 'y', this.y + 140);
        tspan2.setAttributeNS(null, 'font-size', 16 );
        tspan2.setAttributeNS(null, 'fill', 'transparent');
        // flash the return text 
        if ( this.animate < this.limit ){
            tspan2.setAttributeNS(null, 'fill', 'transparent');
        } else if ( this.animate >= this.limit && this.animate < this.limit * 2 ){
            tspan2.setAttributeNS(null, 'fill', '#70B2B1');
        } else if ( this.animate >= this.limit * 2 && this.animate < this.limit * 3 ){
            tspan2.setAttributeNS(null, 'fill', '#26601F');
        } else if ( this.animate >= this.limit * 3 && this.animate < this.limit * 4 ){
            tspan2.setAttributeNS(null, 'fill', '#70B2B1');
        } else if (this.animate >= this.limit * 4 ) {
            this.animate = 0;
        }
        this.animate++;
        
        text.textContent = 'Sorry';
        tspan.textContent = 'Signle mode is not available';
        tspan2.textContent = 'Press <Enter> to go back';
        
        svg.append(text);
        text.append(tspan, tspan2);
    }
}