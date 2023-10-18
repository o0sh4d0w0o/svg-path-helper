import SVGPathEditorArcPoint from "./spe-elements/svg-path-editor-arc-point.js";
import SVGPathEditorArc from "./spe-elements/svg-path-editor-arc.js";
import SVGPathEditorCurvePoint from "./spe-elements/svg-path-editor-curve-point.js";
import SVGPathEditorEndPoint from "./spe-elements/svg-path-editor-end-point.js";
import SVGPathEditorLink from "./spe-elements/svg-path-editor-link.js";
import SVGPathEditorPath from "./spe-elements/svg-path-editor-path.js";
import SVGPathEditorPoint from "./spe-elements/svg-path-editor-point.js";
import SVGPathEditorStartPoint from "./spe-elements/svg-path-editor-start-point.js";
import SVGPathEditorHistory from "./svg-path-editor-history.js";
import {
    createSVGElement,
    getSvgParents,
    calculateScaleAndOffset,
    getAngle,
    copyToClipboard,
} from "./svg-path-editor-utils.js";

export default class SVGPathEditor {
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
