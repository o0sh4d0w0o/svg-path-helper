import SVGPathCommand from "./svg-path-command.js";
import { getRandomID } from "./svg-path-editor-utils.js";
import SVGPathEditor from "./svg-path-editor.js";

const HELPER_CLASS = "svg-path-helper";
let instance = null;

export default class SVGPathHelper {
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
