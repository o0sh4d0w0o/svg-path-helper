import { fixNumber } from "./svg-path-editor-utils.js";

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

export default class SVGPathCommand {
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
