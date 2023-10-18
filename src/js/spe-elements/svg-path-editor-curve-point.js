import { createSVGElement } from "../svg-path-editor-utils.js";
import SVGPathEditorPoint from "./svg-path-editor-point.js";

export default class SVGPathEditorCurvePoint extends SVGPathEditorPoint {
    create() {
        this.element = createSVGElement("circle", {
            r: this.size,
        });

        this.element.classList.add("spe-curve-point");

        this.applyClasses();
    }
}
