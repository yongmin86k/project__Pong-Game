import { SVG_NS, GameOptions } from "../settings";

// method to define who is the winner
export default class Winner {
    constructor( boardWidth ){
        this.x = boardWidth / 2;
        this.animate = 0;
        this.limit = 16;
    }

    render(svg, winner){
        let text = document.createElementNS(SVG_NS, 'text');
        let tspan = document.createElementNS(SVG_NS, 'tspan');
        let tspan2 = document.createElementNS(SVG_NS, 'tspan');
        let y = 120;
        text.setAttributeNS(null, 'x', this.x );
        text.setAttributeNS(null, 'y', y );
        text.setAttributeNS(null, 'font-family', `'Silkscreen Web', monotype`);
        text.setAttributeNS(null, 'font-size', 24 );
        text.setAttributeNS(null, 'fill', '#FFFFFF');
        text.setAttributeNS(null, 'text-anchor', 'middle');

        tspan.setAttributeNS(null, 'x', this.x );
        tspan.setAttributeNS(null, 'y', y + 40);
        tspan.setAttributeNS(null, 'text-anchor', 'middle');
        tspan.setAttributeNS(null, 'fill', 'transparent');
        // flash the return text 
        if ( this.animate < this.limit ){
            tspan.setAttributeNS(null, 'fill', 'transparent');
        } else if ( this.animate >= this.limit && this.animate < this.limit * 2 ){
            tspan.setAttributeNS(null, 'fill', '#70B2B1');
        } else if ( this.animate >= this.limit * 2 && this.animate < this.limit * 3 ){
            tspan.setAttributeNS(null, 'fill', '#26601F');
        } else if ( this.animate >= this.limit * 3 && this.animate < this.limit * 4 ){
            tspan.setAttributeNS(null, 'fill', '#70B2B1');
        } else if (this.animate >= this.limit * 4 ) {
            this.animate = 0;
        }
        this.animate++;

        tspan2.setAttributeNS(null, 'x', this.x );
        tspan2.setAttributeNS(null, 'y', y + 116 );
        tspan2.setAttributeNS(null, 'text-anchor', 'middle');
        tspan2.setAttributeNS(null, 'fill', 'grey');
        tspan2.setAttributeNS(null, 'font-size', 12 );
        
        text.textContent = `The winner is `;
        tspan.textContent = winner;
        tspan2.textContent = 'Press <Enter> to return';

        svg.appendChild(text);
        text.appendChild(tspan);
        text.appendChild(tspan2);
    }

    winnerIs(score1, score2){ 
        const player1_isWinner = score1 >= GameOptions.winningScore;
        const player2_isWinner = score2 >= GameOptions.winningScore;

        if ( player1_isWinner ){
            return this.winner = 'player 1';
        } else if ( player2_isWinner ){
            return this.winner = 'player 2';
        }
    }
}