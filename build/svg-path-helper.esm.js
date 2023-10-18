/*
 * svg-path-helper.js v1.0.0
 * Copyright © 2023 o0sh4d0w0o
 * Released under the MIT license
 * @copyright
*/
const SVG_NS = "http://www.w3.org/2000/svg";

function createSVGElement(type, attributes = {}) {
    const elem = document.createElementNS(SVG_NS, type);

    for (const [key, value] of Object.entries(attributes)) {
        elem.setAttribute(key, value);
    }

    return elem;
}

function getRandomID() {
    const datePart = Date.now().toString(36);
    const pseudoRandomPart = Math.random().toString(36).replace(/0?\./g, "");
    const strongRandomPart = crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);

    return pseudoRandomPart + datePart + strongRandomPart;
}

function fixNumber(num, decimal = 4) {
    return parseFloat(num.toFixed(decimal));
}

function getSvgParents(svg) {
    const svgParents = [];
    let currentElement = svg.parentElement;

    while (currentElement) {
        if (currentElement.tagName.toLowerCase() === "svg") {
            svgParents.push(currentElement);
        }
        currentElement = currentElement.parentElement;
    }

    return svgParents;
}

function calculateScaleAndOffset(element) {
    const style = window.getComputedStyle(element);
    const bounding = element.getBoundingClientRect();
    const viewBox = element.getAttribute("viewBox");
    const styleWidth = parseFloat(style.width);
    const styleHeight = parseFloat(style.height);

    if (!viewBox) {
        return {
            scale: { x: 1, y: 1 },
            offset: { x: 0, y: 0 },
            bounding,
        };
    }

    const [minX, minY, vbWidth, vbHeight] = viewBox.split(" ").map(Number);
    const aspectRatioAttr = element.getAttribute("preserveAspectRatio");
    const aspectRatio = aspectRatioAttr ? aspectRatioAttr.trim() : "xMidYMid meet";
    let width = element.width.baseVal.value;
    let height = element.height.baseVal.value;

    if (styleWidth !== width && style.width !== "auto" && style.width !== "") {
        width = styleWidth;
    }

    if (styleHeight !== height && style.height !== "auto" && style.height !== "") {
        height = styleHeight;
    }

    const noAspect = aspectRatio.includes("none");

    if (noAspect) {
        return {
            scale: { x: vbWidth / width, y: vbHeight / height },
            offset: { x: 0, y: 0 },
            bounding,
        };
    }

    const sliceScale = aspectRatio.includes("slice");
    const viewBoxRatio = vbWidth / vbHeight;
    const boundingRatio = width / height;
    const overflow = viewBoxRatio > boundingRatio;

    const defaultScale = overflow ? vbWidth / width : vbHeight / height;
    const altScale = overflow ? vbHeight / height : vbWidth / width;

    const scaleX = sliceScale ? altScale : defaultScale;
    const scaleY = sliceScale ? altScale : defaultScale;

    const alignments = {
        xMin: 0,
        xMid: (vbWidth - width * scaleX) / 2,
        xMax: vbWidth - width * scaleX,
        yMin: 0,
        yMid: (vbHeight - height * scaleY) / 2,
        yMax: vbHeight - height * scaleY,
    };

    const match = aspectRatio.match(/x(Min|Mid|Max)Y(Min|Mid|Max)/);
    const xAlign = match[1] || "Mid";
    const yAlign = match[2] || "Mid";

    return {
        scale: { x: scaleX, y: scaleY },
        offset: { x: minX + alignments[`x${xAlign}`], y: minY + alignments[`y${yAlign}`] },
        bounding,
    };
}

function rotatePoint(point, angle, distance) {
    const radAngle = (angle - 90) * (Math.PI / 180);

    return {
        x: point.x + distance * Math.cos(radAngle),
        y: point.y + distance * Math.sin(radAngle),
    };
}

function getAngle(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const angle = (Math.atan2(dy, dx) * (180 / Math.PI) + 90) % 360;

    return angle < 0 ? angle + 360 : angle;
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
    } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const successful = document.execCommand("copy");
            document.body.removeChild(textarea);

            if (successful) {
                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        } catch (err) {
            document.body.removeChild(textarea);

            return Promise.reject(err);
        }
    }
}

const COMMANDS_REGEX = {
    GET: /[MLHVCSQTAZ]\s?(?:(?:-?[0-9]*\.?[0-9]+)?(?:\s|$)?)+/gi,
    RELATIVE: /[mlhvcsqtaz]/,
    PARAMS: /-?[0-9]*\.?[0-9]+/g,
};

const PARAMS_MAP = {
    M: ["x", "y"],
    L: ["x", "y"],
    T: ["x", "y"],
    H: ["x"],
    V: ["y"],
    S: ["x1", "y1", "x", "y"],
    Q: ["x1", "y1", "x", "y"],
    C: ["x1", "y1", "x2", "y2", "x", "y"],
    A: ["rx", "ry", "angle", "large", "sweep", "x", "y"],
};

const PARAMS_EXPECTED = {
    M: 2,
    L: 2,
    T: 2,
    H: 1,
    V: 1,
    S: 4,
    Q: 4,
    C: 6,
    A: 7,
    Z: 0,
};

function normalizePath(path) {
    return path
        .replace(/[^0-9A-Z-.]/gi, " ")
        .trim()
        .replace(/\s+/g, " ");
}

class SVGCommand {
    constructor(options) {
        this.options = {
            name: "?",
            parameters: {},
            relative: false,
            implicit: false,
            lastCommand: null,
            ...options,
        };

        this.name = this.options.name;
        this.verticalOnly = this.name === "V";
        this.horizontalOnly = this.name === "H";
        this.parameters = {
            ...this.options.parameters,
        };
        this.relative = this.options.relative;
        this.implicit = this.options.implicit;
        this.lastCommand = this.options.lastCommand;

        this.update();
    }

    get endPosition() {
        if (!this.lastCommand) {
            return { x: this.parameters.x, y: this.parameters.y };
        }

        const lastPos = this.lastCommand.endPosition;

        let x = this.relative === false ? 0 : lastPos.x;
        let y = this.relative === false ? 0 : lastPos.y;

        if (PARAMS_EXPECTED[this.name] > 1) {
            return { x: x + this.parameters.x, y: y + this.parameters.y };
        } else if (PARAMS_EXPECTED[this.name] === 1 && this.horizontalOnly) {
            return { x: x + this.parameters.x, y: y };
        } else if (PARAMS_EXPECTED[this.name] === 1 && this.verticalOnly) {
            return { x: x, y: y + this.parameters.y };
        } else {
            return lastPos;
        }
    }

    getEndPos() {
        return this.lastCommand?.endPosition || { x: 0, y: 0 };
    }

    getAbsolute() {
        this.update();

        if (!this.relative) {
            return this.parameters;
        }

        const params = { ...this.parameters };

        for (let paramName in params) {
            params[paramName] = this.getValue(params[paramName], paramName, true);
        }

        return params;
    }

    getRelative() {
        this.update();

        if (this.relative) {
            return this.parameters;
        }

        const params = { ...this.parameters };

        for (let paramName in params) {
            params[paramName] = this.getValue(params[paramName], paramName, false);
        }

        return params;
    }

    getValue(value, name, relative = this.relative) {
        const pos = this.getEndPos();
        const isX = name.includes("x");
        const isY = name.includes("y");
        const isR = name.includes("r");

        if ((isR && isX) || (isR && isY)) {
            return value;
        }

        if (relative) {
            if (isX) return value + pos.x;
            if (isY) return value + pos.y;
        } else {
            if (isX) return value - pos.x;
            if (isY) return value - pos.y;
        }

        return value;
    }

    setValue(value, name, relative = false) {
        if (!name) {
            return;
        }

        const typeDiff = relative !== this.relative;

        this.parameters[name] = typeDiff ? this.getValue(value, name, relative) : value;
    }

    update() {
        if (this.verticalOnly) {
            this.setValue(this.getEndPos().x, "x");
        }

        if (this.horizontalOnly) {
            this.setValue(this.getEndPos().y, "y");
        }
    }
}

class SVGPathCommand {
    constructor(path) {
        this.path = path;
        this.list = [];
        this.parse();
    }

    parse() {
        const commands = normalizePath(this.path).match(COMMANDS_REGEX.GET);
        let lastCommand = null;

        commands?.forEach((commandStr) => {
            const relative = COMMANDS_REGEX.RELATIVE.test(commandStr[0]);
            const commandName = commandStr[0].toUpperCase();
            const commandParams = commandStr.match(COMMANDS_REGEX.PARAMS)?.map(parseFloat) || [];
            let paramsToProcess = [...commandParams];
            let firstPass = true;

            do {
                const params = paramsToProcess.splice(0, PARAMS_EXPECTED[commandName]);
                const parameters = {};

                PARAMS_MAP[commandName]?.forEach((param, idx) => {
                    parameters[param] = params[idx];
                });

                const command = new SVGCommand({
                    name: commandName,
                    parameters,
                    relative,
                    implicit: !firstPass,
                    lastCommand: lastCommand,
                });

                lastCommand = command;
                this.list.push(command);

                firstPass = false;
            } while (paramsToProcess.length > 0);
        });
    }

    build() {
        return this.list
            .map((command) => {
                const commandName = command.relative ? command.name.toLowerCase() : command.name;
                const params = command.relative ? command.getRelative() : command.getAbsolute();
                const paramsStr = PARAMS_MAP[command.name]?.map((name) => fixNumber(params[name])).join(" ") || "";

                return `${command.implicit ? "" : commandName}${paramsStr}`;
            })
            .join(" ");
    }
}

class SVGPathEditorPoint {
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

class SVGPathEditorArcPoint extends SVGPathEditorPoint {
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

class SVGPathEditorArc {
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

class SVGPathEditorCurvePoint extends SVGPathEditorPoint {
    create() {
        this.element = createSVGElement("circle", {
            r: this.size,
        });

        this.element.classList.add("spe-curve-point");

        this.applyClasses();
    }
}

class SVGPathEditorEndPoint extends SVGPathEditorPoint {
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

class SVGPathEditorLink {
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

class SVGPathEditorPath {
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

class SVGPathEditorStartPoint extends SVGPathEditorPoint {
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

class SVGPathEditorHistory {
    constructor() {
        this.history = { undo: [], redo: [] };
        this.historyIndex = -1;
        this.current = null;
    }

    add(target, type = "undo") {
        if (!target) return;

        let targetList = [];
        const datas = [];

        if (!Array.isArray(target)) {
            targetList.push(target);
        } else {
            targetList = target;
        }

        this.current = this.current || {};

        targetList.forEach((target) => {
            const data = {
                target,
                position: {
                    x: target.x || null,
                    y: target.y || null,
                },
                angle: target.angle,
                command: { ...target.command.parameters },
            };

            datas.push(data);
        });

        this.current[type] = datas;
    }

    undo() {
        if (!this.canUndo()) return;

        this.restore(this.history.undo[this.historyIndex]);
        this.historyIndex--;
    }

    redo() {
        if (!this.canRedo()) return;

        this.historyIndex++;
        this.restore(this.history.redo[this.historyIndex]);
    }

    restore(datas) {
        if (!datas) return;

        datas.forEach((data) => {
            const target = data.target;
            target.x = data.position.x;
            target.y = data.position.y;
            target.angle = data.angle;

            for (const paramName in target.command.parameters) {
                target.command.parameters[paramName] = data.command[paramName];
            }

            target.set();
        });
    }

    isDataChanged(data1, data2) {
        if (Array.isArray(data1) && Array.isArray(data2)) {
            if (data1.length !== data2.length) return true;

            for (let i = 0; i < data1.length; i++) {
                if (this.isDataChanged(data1[i], data2[i])) return true;
            }

            return false;
        }

        if (data1 && typeof data1 === "object" && data2 && typeof data2 === "object") {
            const keys1 = Object.keys(data1);
            const keys2 = Object.keys(data2);

            if (keys1.length !== keys2.length) return true;

            for (const key of keys1) {
                if (key === "target") {
                    continue;
                }

                if (this.isDataChanged(data1[key], data2[key])) return true;
            }

            return false;
        }

        return data1 !== data2;
    }

    save() {
        if (!this.current) return;

        const targets = this.current.undo.map((data) => data.target);

        this.add(targets, "redo");

        const lastUndo = this.history.undo[this.historyIndex - 1];
        const lastUndoChanged = lastUndo ? this.isDataChanged(this.current.undo, lastUndo) : true;
        const redoChanged = this.isDataChanged(this.current.undo, this.current.redo);

        if (lastUndoChanged && redoChanged) {
            if (this.historyIndex < this.history.undo.length - 1) {
                this.history.undo = this.history.undo.slice(0, this.historyIndex + 1);
                this.history.redo = this.history.redo.slice(0, this.historyIndex + 1);
            }

            this.history.undo.push(this.current.undo);
            this.history.redo.push(this.current.redo);
            this.historyIndex++;
        }

        this.current = null;
    }

    canUndo() {
        return this.historyIndex >= 0;
    }

    canRedo() {
        return this.historyIndex < this.history.redo.length - 1;
    }
}

class SVGPathEditor {
    static CLASSNAME = "svg-path-editor";

    static instances = [];

    static handleMouseDown(e) {
        SVGPathEditor.instances.forEach((instance) => instance.onMouseDown(e));
    }

    static handleMouseMove(e) {
        SVGPathEditor.instances.forEach((instance) => instance.onMouseMove(e));
    }

    static handleMouseUp(e) {
        SVGPathEditor.instances.forEach((instance) => instance.onMouseUp(e));
    }

    static handleKeyDown(e) {
        SVGPathEditor.instances.forEach((instance) => instance.onKeyDown(e));
    }

    static handleKeyUp(e) {
        SVGPathEditor.instances.forEach((instance) => instance.onKeyUp(e));
    }

    constructor(options) {
        SVGPathEditor.instances.push(this);

        this.options = {
            container: null,
            path: null,
            ...options,
        };

        this.path = this.options.path;
        this.container = this.options.container;

        this.keyModifierPressed = {};

        this.pointDragging = {
            active: false,
            target: null,
        };

        this.pathDragging = {
            active: false,
        };

        this.elements = {
            svgParents: getSvgParents(this.container),
        };

        this.history = new SVGPathEditorHistory();

        this.pathSize = 0;
        this.snapRotation = 90;
        this.snapDistance = 5;

        this.init();
    }

    isActive() {
        const path = this.elements.path;

        if (path.active) {
            return true;
        }

        for (const point of path.points) {
            if (point.active) {
                return true;
            }
        }

        return false;
    }

    init() {
        if (SVGPathEditor.instances.length === 1) {
            document.addEventListener("mousedown", SVGPathEditor.handleMouseDown);
            document.addEventListener("mousemove", SVGPathEditor.handleMouseMove);
            document.addEventListener("mouseup", SVGPathEditor.handleMouseUp);
            document.addEventListener("keydown", SVGPathEditor.handleKeyDown);
            document.addEventListener("keyup", SVGPathEditor.handleKeyUp);
        }

        const elements = this.createEditor();

        this.elements.element = elements.element;
        this.elements.path = elements.path;
    }

    createEditor() {
        const editor = createSVGElement("g");
        const editorPath = new SVGPathEditorPath(this.path);

        editor.classList.add(SVGPathEditor.CLASSNAME);

        editor.appendChild(editorPath.element);

        return { element: editor, path: editorPath };
    }

    setScaleAndOffset() {
        const viewboxData = calculateScaleAndOffset(this.container);

        for (let i = this.elements.svgParents.length - 1; i === 0; i--) {
            const parentSVG = this.elements.svgParents[i];
            const parentViewboxData = calculateScaleAndOffset(parentSVG);

            viewboxData.scale.x *= parentViewboxData.scale.x;
            viewboxData.scale.y *= parentViewboxData.scale.y;

            viewboxData.offset.x = viewboxData.offset.x * parentViewboxData.scale.x + parentViewboxData.offset.x;
            viewboxData.offset.y = viewboxData.offset.y * parentViewboxData.scale.y + parentViewboxData.offset.y;
        }

        this.scale = viewboxData.scale;
        this.viewBoxOffset = viewboxData.offset;
        this.bounding = viewboxData.bounding;
    }

    getPoint(element) {
        const path = this.elements.path;
        const points = path.getAllPoints();

        for (const point of points) {
            if (point.element === element) {
                return point;
            }
        }

        return false;
    }

    getPath(element) {
        const path = this.elements.path;

        if (path.element === element) {
            return path;
        }

        return false;
    }

    snapAngle(angle) {
        const remainder = angle % this.snapRotation;

        if (remainder < this.snapDistance) {
            return angle - remainder;
        } else if (this.snapRotation - remainder < this.snapDistance) {
            return angle + (this.snapRotation - remainder);
        }

        return angle;
    }

    getScaledPosition(event) {
        const x = (event.clientX - this.bounding.left) * this.scale.x + this.viewBoxOffset.x;
        const y = (event.clientY - this.bounding.top) * this.scale.y + this.viewBoxOffset.y;
        return { x, y };
    }

    onMouseDown(event) {
        if (event.button === 2) return false;

        const point = this.getPoint(event.target);
        const path = this.getPath(event.target);

        this.elements.path.points.forEach((otherPoint) => {
            if (point && (point === otherPoint || point.linkedTo(otherPoint))) {
                otherPoint.select();
            } else {
                otherPoint.unSelect();
            }
        });

        if (!path) {
            this.elements.path.unSelect();
        }

        if (!point && !path) return false;

        this.setScaleAndOffset();

        const scaledPos = this.getScaledPosition(event);

        if (path) {
            path.select();

            this.pathDragging = {
                active: true,
                target: path,
                offsetX: scaledPos.x,
                offsetY: scaledPos.y,
            };

            this.history.add(path.points);
        } else {
            this.elements.path.unSelect();

            this.pointDragging = {
                active: true,
                target: point,
                offsetX: scaledPos.x - point.x,
                offsetY: scaledPos.y - point.y,
            };

            this.history.add(point);
        }
    }

    onMouseMove(event) {
        const isPath = this.pathDragging.active;
        const dragData = isPath ? this.pathDragging : this.pointDragging;

        if (!dragData.active) return;

        const target = dragData.target;
        const scaledPos = this.getScaledPosition(event);
        const x = scaledPos.x - dragData.offsetX;
        const y = scaledPos.y - dragData.offsetY;

        if (isPath) {
            target.x = this.keyModifierPressed.alt ? 0 : x;
            target.y = this.keyModifierPressed.shift ? 0 : y;

            target.set();

            dragData.offsetX = scaledPos.x;
            dragData.offsetY = scaledPos.y;
        } else {
            if (target.isHorizontal && !this.keyModifierPressed.alt) {
                target.x = x;
            }

            if (target.isVertical && !this.keyModifierPressed.shift) {
                target.y = y;
            }

            if (target.isAngle) {
                target.angle = this.snapAngle(getAngle(target.centerPoint, { x, y }));
            }

            target.set();
        }

        this.updatePath();
    }

    onMouseUp(event) {
        const point = this.getPoint(event.target);

        if (event.button === 2) {
            this.onContextMenu(point);
        } else {
            this.pathDragging = {
                active: false,
                target: null,
                offsetX: 0,
                offsetY: 0,
            };

            this.pointDragging = {
                active: false,
                target: null,
                offsetX: 0,
                offsetY: 0,
            };
        }

        this.history.save();
    }

    onContextMenu(point) {
        if (!point || !point.active) return;

        if (this.keyModifierPressed.shift) {
            point.arcs.forEach((arc) => {
                if (arc.p1 === point) {
                    this.history.add(arc);
                    arc.triggerSweep();
                }
            });
        } else {
            this.history.add(point);
            point.arcs.forEach((arc) => {
                if (arc.p1 === point) {
                    this.history.add(arc);
                    arc.triggerLarge();
                }
            });
        }

        this.updatePath();
    }

    onKeyDown(event) {
        const { ctrlKey, shiftKey } = event;
        const { shift, z, y, c } = this.keyModifierPressed;
        const path = this.elements.path;
        const key = event.key.toLowerCase();
        const active = this.isActive();

        this.updateKeyModifiers(event);
        if (ctrlKey && key === "c" && active && !c) {
            copyToClipboard(path.getValue());
        } else if (ctrlKey && key === "z" && active && !z) {
            this.history.undo();
            this.updatePath();
        } else if (ctrlKey && key === "y" && active && !y) {
            this.history.redo();
            this.updatePath();
        } else if (ctrlKey && shiftKey && !shift) {
            this.togglePointsSelection();
        }
    }

    onKeyUp(event) {
        this.updateKeyModifiers(event);
    }

    updateKeyModifiers(event) {
        const { ctrlKey, shiftKey, altKey } = event;
        const key = event.key.toLowerCase();

        if (altKey) {
            event.preventDefault();
        }

        this.keyModifierPressed = {
            ...this.keyModifierPressed,
            ctrl: ctrlKey,
            shift: shiftKey,
            alt: altKey,
            [key]: event.type === "keydown" ? true : false,
        };
    }

    togglePointsSelection() {
        const path = this.elements.path;
        const selectedPoints = path.points.filter((point) => point.active);
        const allPointSelected = selectedPoints.length === path.points.length;

        path.points.forEach((point) => {
            if (!allPointSelected) {
                path.unSelect();
                point.select();
            } else {
                point.unSelect();
            }
        });
    }

    updatePath() {
        const path = this.elements.path;
        const { commands } = this.options;

        path.getAllPoints().forEach((point) => {
            const params = point.command.getAbsolute();
            const pointParams = point.commandParams;

            if (pointParams.x) {
                point.x = params[pointParams.x];
            }

            if (pointParams.y) {
                point.y = params[pointParams.y];
            }

            point.set();
        });

        this.elements.path.setValue(commands.build());
    }

    addStartPoint(x, y, commandData) {
        const path = this.elements.path;
        const startPoint = new SVGPathEditorStartPoint(x, y, path.size * 1.5, commandData);
        path.addPoint(startPoint);
    }

    addEndPoint(x, y, commandData) {
        const path = this.elements.path;
        const endPoint = new SVGPathEditorEndPoint(x, y, path.size * 1.2, commandData);
        path.addPoint(endPoint);
    }

    addPoint(x, y, commandData) {
        const path = this.elements.path;
        const point = new SVGPathEditorPoint(x, y, path.size * 0.8, commandData);
        path.addPoint(point);
    }

    addCurvePoint(x, y, commandData) {
        const path = this.elements.path;
        const curvePoint = new SVGPathEditorCurvePoint(x, y, path.size * 0.6, commandData);
        path.addCurvePoint(curvePoint);
    }

    addArcPoint(point, commandData) {
        const path = this.elements.path;
        const arcPoint = new SVGPathEditorArcPoint(point, path.size * 0.6, commandData);
        path.addArcPoint(arcPoint);
    }

    addArc(p1, p2, commandData) {
        const path = this.elements.path;
        const arc = new SVGPathEditorArc(p1, p2, path.size, commandData);
        path.addArc(arc);
    }

    addLink() {
        const path = this.elements.path;
        const [p1, p2] = [path.getLastModifier(), path.getLastPoint()];

        const link = new SVGPathEditorLink(p1, p2, path.size * 0.9);
        path.addLink(link);
    }

    build() {
        const { element, path } = this.elements;

        path.getElements().forEach((pathElement) => {
            element.append(pathElement.element);
        });

        this.container.append(element);
    }

    destroy() {
        if (SVGPathEditor.instances.length === 0) {
            document.removeEventListener("mousedown", SVGPathEditor.handleMouseDown);
            document.removeEventListener("mousemove", SVGPathEditor.handleMouseMove);
            document.removeEventListener("mouseup", SVGPathEditor.handleMouseUp);
            document.removeEventListener("keydown", SVGPathEditor.handleKeyDown);
            document.removeEventListener("keyup", SVGPathEditor.handleKeyUp);
        }

        this.elements.element.remove();
    }
}

const HELPER_CLASS = "svg-path-helper";
let instance = null;

class SVGPathHelper {
    constructor() {
        if (instance) {
            return instance;
        }

        this.commandHandlers = this.initCommandHandlers();

        this.list = [];
        this.current = {};

        instance = this;
    }

    getPaths(element) {
        let paths = Array.from(element.querySelectorAll("path"));

        paths = paths.filter((path) => {
            if (path.closest(`.${SVGPathEditor.CLASSNAME}`)) {
                return false;
            }

            if (path.closest("svg") !== element) {
                return false;
            }

            for (const helper of this.list) {
                const matchPath = helper.paths.filter((pathData) => pathData.element === path);

                if (matchPath.length > 0) {
                    return false;
                }
            }

            return true;
        });

        return paths.map(parsePath).filter(Boolean);
    }

    add(container, name = getRandomID()) {
        let helpers = [];

        if (container instanceof SVGElement && container.classList.contains(HELPER_CLASS)) {
            helpers.push({ name, container, element: container, paths: this.getPaths(container) });
        } else {
            container.querySelectorAll(`svg.${HELPER_CLASS}, svg.${HELPER_CLASS} svg`).forEach((svg) => {
                helpers.push({ name, container, element: svg, paths: this.getPaths(svg) });
            });
        }

        helpers = helpers.filter((helper) => helper.element && helper.paths.length > 0);

        this.list.push(...helpers);
        this.draw(helpers);
    }

    remove(container) {
        this.list.forEach((helper) => {
            if (helper.container === container) {
                this.removeByHelper(helper);
            }
        });
    }

    removeByName(name) {
        this.list.forEach((helper) => {
            if (helper.name === name) {
                this.removeByHelper(helper);
            }
        });
    }

    removeByPath(path) {
        this.list.forEach((helper) => {
            helper.paths.forEach((pathData) => {
                if (pathData.element === path) {
                    pathData.editor.destroy();
                }
            });
        });
    }

    removeByHelper(helper) {
        const index = this.list.indexOf(helper);

        if (index > -1) {
            helper.paths.forEach((pathData) => pathData.editor.destroy());
            this.list.splice(index, 1);
        }
    }

    clear() {
        this.list.forEach((helper) => this.removeByHelper(helper));
        this.list.length = 0;
    }

    initCommandHandlers() {
        return {
            M: this.pointHandler,
            L: this.pointHandler,
            T: this.pointHandler,
            H: this.pointHandler,
            V: this.pointHandler,
            S: this.curveHandler,
            Q: this.curveHandler,
            C: this.cubicBezierHandler,
            A: this.arcHandler,
        };
    }

    draw(helpers) {
        helpers.forEach((helper) => {
            helper.paths.forEach((pathData) => this.drawPath(pathData));
        });
    }

    drawPath(pathData) {
        const path = pathData.element;
        const editor = new SVGPathEditor({ container: path.parentNode, path, commands: pathData.commands });
        const commandLength = pathData.commands.list.length;

        pathData.commands.list.forEach((command, index) => {
            const handler = this.commandHandlers[command.name];

            this.current = {
                command,
                index,
                editor,
                length: commandLength,
            };

            if (handler) {
                handler.call(this);
            }
        });

        editor.build();

        pathData.editor = editor;
    }

    pointHandler() {
        const { command } = this.current;
        const { x, y } = command.getAbsolute();

        this.addPoint(x, y, {
            command,
            params: {
                x: "x",
                y: "y",
            },
        });
    }

    curveHandler() {
        const { command, editor } = this.current;
        const { x, y, x1, y1 } = command.getAbsolute();

        editor.addCurvePoint(x1, y1, {
            command,
            params: {
                x: "x1",
                y: "y1",
            },
        });

        this.addPoint(x, y, {
            command,
            params: {
                x: "x",
                y: "y",
            },
        });

        editor.addLink();
    }

    cubicBezierHandler() {
        const { command, editor } = this.current;
        const { x, y, x1, y1, x2, y2 } = command.getAbsolute();

        editor.addCurvePoint(x1, y1, {
            command,
            params: {
                x: "x1",
                y: "y1",
            },
        });

        editor.addLink();

        editor.addCurvePoint(x2, y2, {
            command,
            params: {
                x: "x2",
                y: "y2",
            },
        });

        this.addPoint(x, y, {
            command,
            params: {
                x: "x",
                y: "y",
            },
        });

        editor.addLink();
    }

    arcHandler() {
        const { command, editor } = this.current;
        const { x, y } = command.getAbsolute();
        const path = editor.elements.path;
        const p2 = path.getLastPoint();

        this.addPoint(x, y, {
            command,
            params: {
                x: "x",
                y: "y",
            },
        });

        const p1 = path.getLastPoint();

        editor.addArc(p1, p2, {
            command,
            params: {
                x: "rx",
                y: "ry",
            },
        });

        editor.addArcPoint(p1, {
            command,
            params: {
                x: "rx",
            },
        });
        editor.addLink();

        editor.addArcPoint(p1, {
            command,
            params: {
                y: "ry",
            },
        });
        editor.addLink();

        editor.addArcPoint(p1, {
            command,
            params: {
                angle: "angle",
            },
        });
        editor.addLink();
    }

    addPoint(x, y, commandData) {
        const { editor, index, length } = this.current;

        if (index === 0) {
            editor.addStartPoint(x, y, commandData);
        } else if (index === length - 1) {
            editor.addEndPoint(x, y, commandData);
        } else {
            editor.addPoint(x, y, commandData);
        }
    }
}

function parsePath(svgPath) {
    const pathCommand = svgPath.getAttribute("d");
    if (!pathCommand || !pathCommand.trim()) return null;

    return {
        element: svgPath,
        commands: new SVGPathCommand(pathCommand),
    };
}

export { SVGPathHelper as default };
