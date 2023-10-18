export default class SVGPathEditorHistory {
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
