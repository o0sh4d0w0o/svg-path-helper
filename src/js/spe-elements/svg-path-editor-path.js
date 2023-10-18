import { getRandomID, createSVGElement, fixNumber } from "../svg-path-editor-utils.js";

export default class SVGPathEditorPath {
    constructor(path) {
        this.element = null;

        this.id = getRandomID();
        this.x = 0;
        this.y = 0;
        this.size = 1;
        this.points = [];
        this.curvePoints = [];
        this.arcPoints = [];
        this.links = [];
        this.arcs = [];
        this.active = false;
        this.lastPoint = null;
        this.lastModifier = null;

        this.create(path);
        this.set();
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(value) {
        this._x = fixNumber(value);
    }

    set y(value) {
        this._y = fixNumber(value);
    }

    create(basePath) {
        const basePathStyle = window.getComputedStyle(basePath);
        const path = basePath.cloneNode();
        const pathAttrs = path.getAttributeNames();
        const pathWidth = parseFloat(basePathStyle.strokeWidth);

        if (pathWidth) {
            this.size = fixNumber(pathWidth);
        }

        pathAttrs.forEach((attrName) => {
            if (attrName !== "d") path.removeAttribute(attrName);
        });

        path.setAttribute("class", "spe-path");
        path.setAttribute("stroke-width", this.size);

        this.element = path;
    }

    addPoint(point) {
        if (point) {
            this.points.push(point);
            this.lastPoint = point;
        }
    }

    addCurvePoint(curvePoint) {
        if (curvePoint) {
            this.curvePoints.push(curvePoint);
            this.lastModifier = curvePoint;
        }
    }

    addArcPoint(arcPoint) {
        if (arcPoint) {
            this.arcPoints.push(arcPoint);
            this.lastModifier = arcPoint;
        }
    }

    addArc(arc) {
        if (arc) {
            this.arcs.push(arc);
        }
    }

    addLink(link) {
        if (link) {
            this.links.push(link);
        }
    }

    getValue() {
        return this.element.getAttribute("d");
    }

    getLastModifier() {
        return this.lastModifier;
    }

    getLastPoint() {
        return this.lastPoint;
    }

    getAllPoints() {
        return [...this.points, ...this.curvePoints, ...this.arcPoints];
    }

    getElements() {
        return [...this.arcs, ...this.links, ...this.getAllPoints()];
    }

    setValue(value) {
        this.element.setAttribute("d", value);
    }

    set() {
        this.points.forEach((point) => {
            point.x += this.x;
            point.y += this.y;

            point.set();
        });

        this.curvePoints.forEach((curvePoint) => {
            curvePoint.x += this.x;
            curvePoint.y += this.y;

            curvePoint.set();
        });
    }

    select() {
        if (this.active) {
            return;
        }

        this.active = true;

        this.element.classList.add("active");
    }

    unSelect() {
        if (!this.active) {
            return;
        }

        this.active = false;

        this.element.classList.remove("active");
    }
}
