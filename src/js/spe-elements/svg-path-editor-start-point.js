import { createSVGElement, fixNumber } from "../svg-path-editor-utils.js";
import SVGPathEditorPoint from "./svg-path-editor-point.js";

export default class SVGPathEditorStartPoint extends SVGPathEditorPoint {
    create() {
        this.element = createSVGElement("polygon", {
            "stroke-width": this.size * 0.5,
        });

        this.element.classList.add("spe-start-point");

        this.applyClasses();
    }

    set() {
        const midSize = fixNumber(this.size / 2);
        const p1 = `${fixNumber(this.x - midSize)} ${this.y}`;
        const p2 = `${this.x} ${fixNumber(this.y + midSize)}`;
        const p3 = `${fixNumber(this.x + midSize)} ${this.y}`;
        const p4 = `${this.x} ${fixNumber(this.y - midSize)}`;

        this.element.setAttribute("points", `${p1}, ${p2}, ${p3}, ${p4}`);

        this.update();
    }
}
