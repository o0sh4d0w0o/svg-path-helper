import { getRandomID, createSVGElement, fixNumber } from "../svg-path-editor-utils.js";

export default class SVGPathEditorArc {
    constructor(p1, p2, size, commandData) {
        this.element = null;
        this.elements = {};

        this.id = getRandomID();
        this.p1 = p1;
        this.p2 = p2;
        this.size = fixNumber(size * 0.3);
        this.selectedSize = fixNumber(size);
        this.command = commandData.command;
        this.commandParams = commandData.params;
        this.active = false;

        p1.addArc(this);
        p2.addArc(this);

        this.create();
        this.set();
    }

    triggerLarge() {
        this.command.parameters.large = Number(!this.command.parameters.large);
        this.set();
    }

    triggerSweep() {
        this.command.parameters.sweep = Number(!this.command.parameters.sweep);
        this.set();
    }

    create() {
        const wrapper = createSVGElement("g");

        const arcSweepLarge = createSVGElement("path", {
            "stroke-width": this.size,
        });

        const arcSweep = createSVGElement("path", {
            "stroke-width": this.size,
        });

        const arc = createSVGElement("path", {
            "stroke-width": this.size,
        });

        const arcLarge = createSVGElement("path", {
            "stroke-width": this.size,
        });

        wrapper.classList.add("spe-arc-wrapper");
        arcSweepLarge.classList.add("spe-arc", "sweep", "large");
        arcSweepLarge.classList.add("spe-arc", "sweep", "large");
        arcSweep.classList.add("spe-arc", "sweep");
        arc.classList.add("spe-arc");
        arcLarge.classList.add("spe-arc", "large");

        wrapper.append(arcSweepLarge, arcSweep, arc, arcLarge);

        this.element = wrapper;
        this.elements.arcSweepLarge = arcSweepLarge;
        this.elements.arcSweep = arcSweep;
        this.elements.arc = arc;
        this.elements.arcLarge = arcLarge;
    }

    set() {
        const { sweep, large } = this.command.parameters;

        for (const name in this.elements) {
            this.elements[name].classList.remove("selected");
            this.elements[name].setAttribute("stroke-width", this.size);
        }

        let selected = null;

        if (sweep && large) {
            selected = this.elements.arcSweepLarge;
        }

        if (sweep && !large) {
            selected = this.elements.arcSweep;
        }

        if (!sweep && !large) {
            selected = this.elements.arc;
        }

        if (!sweep && large) {
            selected = this.elements.arcLarge;
        }

        selected.classList.add("selected");
        selected.setAttribute("stroke-width", this.selectedSize);

        this.element.append(selected);

        this.elements.arcSweepLarge.setAttribute("d", this.getArc(1, 1));
        this.elements.arcSweep.setAttribute("d", this.getArc(0, 1));
        this.elements.arc.setAttribute("d", this.getArc(0, 0));
        this.elements.arcLarge.setAttribute("d", this.getArc(1, 0));
    }

    getArc(large, sweep) {
        const { p1, p2 } = this;
        const { rx, ry, angle } = this.command.parameters;

        return `M${p2.x} ${p2.y} A${rx} ${ry} ${angle} ${large} ${sweep} ${p1.x} ${p1.y}`;
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
