import { getRandomID, createSVGElement, fixNumber } from "../svg-path-editor-utils.js";

export default class SVGPathEditorPoint {
    constructor(x, y, size, commandData) {
        this.element = null;

        this.id = getRandomID();
        this.x = x;
        this.y = y;
        this.size = fixNumber(size);
        this.command = commandData.command;
        this.commandParams = commandData.params;
        this.isAngle = this.commandParams.angle;
        this.isHorizontal = this.command.name !== "V" && this.commandParams.x;
        this.isVertical = this.command.name !== "H" && this.commandParams.y;
        this.links = [];
        this.arcs = [];
        this.active = false;

        this.create();
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

    addLink(link) {
        this.links.push(link);
    }

    addArc(arc) {
        this.arcs.push(arc);
    }

    create() {
        this.element = createSVGElement("circle", {
            r: this.size,
            "stroke-width": fixNumber(this.size * 1.25),
        });

        this.element.classList.add("spe-point");

        this.applyClasses();
    }

    applyClasses() {
        const classes = [];

        if (this.isAngle) {
            classes.push("angle");
        }

        if (this.isVertical && !this.isHorizontal && !this.isAngle) {
            classes.push("vertical");
        }

        if (this.isHorizontal && !this.isVertical && !this.isAngle) {
            classes.push("horizontal");
        }

        if (classes.length > 0) {
            this.element.classList.add(...classes);
        }

        return classes;
    }

    set() {
        this.element.setAttribute("cx", this.x);
        this.element.setAttribute("cy", this.y);

        this.update();
    }

    update() {
        this.links.forEach((link) => {
            link.set();
        });

        this.arcs.forEach((arc) => {
            arc.set();
        });

        this.command.setValue(this.x, this.commandParams.x);
        this.command.setValue(this.y, this.commandParams.y);

        if (this.commandParams.angle) {
            this.command.setValue(this.angle, this.commandParams.angle);
        }
    }

    linkedTo(point, checkedPoints = new Set()) {
        if (checkedPoints.has(this)) {
            return false;
        }

        checkedPoints.add(this);

        for (const link of this.links) {
            if (link.p1 === point || link.p2 === point) {
                return true;
            }

            if (link.p1.linkedTo(point, checkedPoints)) {
                return true;
            }

            if (link.p2.linkedTo(point, checkedPoints)) {
                return true;
            }
        }

        for (const arc of this.arcs) {
            if (arc.p1 === point || arc.p2 === point) {
                return true;
            }

            if (arc.p1.linkedTo(point, checkedPoints)) {
                return true;
            }

            if (arc.p2.linkedTo(point, checkedPoints)) {
                return true;
            }
        }

        return false;
    }

    select() {
        if (this.active) {
            return;
        }

        this.active = true;

        this.element.classList.add("active");

        this.links.forEach((link) => {
            link.select();
        });

        this.arcs.forEach((arc) => {
            arc.select();
        });
    }

    unSelect() {
        if (!this.active) {
            return;
        }

        this.active = false;

        this.element.classList.remove("active");

        this.links.forEach((link) => {
            link.unSelect();
        });

        this.arcs.forEach((arc) => {
            arc.unSelect();
        });
    }
}
