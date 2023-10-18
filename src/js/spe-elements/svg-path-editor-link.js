import { getRandomID, createSVGElement, fixNumber } from "../svg-path-editor-utils.js";

export default class SVGPathEditorLink {
    constructor(p1, p2, size) {
        this.element = null;

        this.id = getRandomID();
        this.p1 = p1;
        this.p2 = p2;
        this.size = fixNumber(size);
        this.active = false;

        p1.addLink(this);
        p2.addLink(this);

        this.create();
        this.set();
    }

    create() {
        this.element = createSVGElement("line", {
            "stroke-width": this.size,
        });

        this.element.classList.add("spe-link");
    }

    set() {
        const p1x = this.p1.getArcRx ? this.p1.getArcRx() : this.p1.x;
        const p1y = this.p1.getArcRy ? this.p1.getArcRy() : this.p1.y;
        const p2x = this.p2.getArcRx ? this.p2.getArcRx() : this.p2.x;
        const p2y = this.p2.getArcRy ? this.p2.getArcRy() : this.p2.y;

        this.element.setAttribute("x1", p1x);
        this.element.setAttribute("y1", p1y);
        this.element.setAttribute("x2", p2x);
        this.element.setAttribute("y2", p2y);
    }

    select() {
        if (this.active) {
            return;
        }

        this.active = true;

        this.element.classList.add("active");

        this.p1.select();
        this.p2.select();
    }

    unSelect() {
        if (!this.active) {
            return;
        }

        this.active = false;

        this.element.classList.remove("active");

        this.p1.unSelect();
        this.p2.unSelect();
    }
}
