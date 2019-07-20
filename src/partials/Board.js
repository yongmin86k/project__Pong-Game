import { SVG_NS } from "../settings";

export default class Board {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    } // end of constructor
    
    render(svg) {
      // create rect
        let rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttributeNS(null, 'fill', '#353535');
        rect.setAttributeNS(null, 'width', this.width);
        rect.setAttributeNS(null, 'height', this.height);

        // append rect
        svg.appendChild(rect);
    }
  }