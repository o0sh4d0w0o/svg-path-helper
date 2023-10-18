import { createSVGElement, fixNumber } from "../svg-path-editor-utils.js";
import SVGPathEditorPoint from "./svg-path-editor-point.js";

export default class SVGPathEditorEndPoint extends SVGPathEditorPoint {
    create() {
        this.element = createSVGElement("rect", {
            width: this.size,
            height: this.size,
            "stroke-width": this.size * 0.5,
        });

        this.element.classList.add("spe-end-point");

        this.applyClasses();
    }

    set() {
        const midSize = fixNumber(this.size / 2);

        this.element.setAttribute("x", fixNumber(this.x - midSize));
        this.element.setAttribute("y", fixNumber(this.y - midSize));

        this.update();
    }
}
