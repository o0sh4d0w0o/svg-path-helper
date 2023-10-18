import { createSVGElement, fixNumber, rotatePoint } from "../svg-path-editor-utils.js";
import SVGPathEditorPoint from "./svg-path-editor-point.js";

export default class SVGPathEditorArcPoint extends SVGPathEditorPoint {
    constructor(point, size, commandData) {
        super(0, 0, size, commandData);

        this.angle = this.command.parameters.angle;
        this.x = this.command.parameters.rx;
        this.y = this.command.parameters.ry;

        this.centerPoint = point;

        this.set();
    }

    getArcRx() {
        if (this.isAngle) {
            return this.x;
        }

        if (this.isHorizontal) {
            return fixNumber(this.centerPoint.x + this.x);
        } else {
            return this.centerPoint.x;
        }
    }

    getArcRy() {
        if (this.isAngle) {
            return this.y;
        }

        if (this.isVertical) {
            return fixNumber(this.centerPoint.y + this.y);
        } else {
            return this.centerPoint.y;
        }
    }

    create() {
        this.element = createSVGElement("circle", {
            r: this.size,
        });

        this.element.classList.add("spe-arc-point");

        this.applyClasses();
    }

    set() {
        if (!this.centerPoint) {
            return;
        }

        if (this.isAngle) {
            const rotatedPoint = rotatePoint(this.centerPoint, this.angle, 10);

            this.x = rotatedPoint.x;
            this.y = rotatedPoint.y;
        }

        this.element.setAttribute("cx", this.getArcRx());
        this.element.setAttribute("cy", this.getArcRy());

        this.update();
    }
}
