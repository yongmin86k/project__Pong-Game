import { SVG_NS } from "../settings";
export default class Net {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    } // end of constructor
    
    render(svg) {
      // create line
        let line = document.createElementNS(SVG_NS, 'line');
        line.setAttributeNS(null, 'x1', (this.width / 2) );
        line.setAttributeNS(null, 'y1', 0 );
        line.setAttributeNS(null, 'x2', (this.width / 2) );
        line.setAttributeNS(null, 'y2', this.height );
  
        line.setAttributeNS(null, 'stroke', '#FFFFFF');
        line.setAttributeNS(null, 'stroke-width', 2);
        line.setAttributeNS(null, 'stroke-dasharray', [16, 34]);
        line.setAttributeNS(null, 'stroke-dashoffset', 4);
  
        // append line
        svg.appendChild(line);
    }
  }