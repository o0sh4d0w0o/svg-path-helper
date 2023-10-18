const SVG_NS = "http://www.w3.org/2000/svg";

export function createSVGElement(type, attributes = {}) {
    const elem = document.createElementNS(SVG_NS, type);

    for (const [key, value] of Object.entries(attributes)) {
        elem.setAttribute(key, value);
    }

    return elem;
}

export function getRandomID() {
    const datePart = Date.now().toString(36);
    const pseudoRandomPart = Math.random().toString(36).replace(/0?\./g, "");
    const strongRandomPart = crypto.getRandomValues(new BigUint64Array(1))[0].toString(36);

    return pseudoRandomPart + datePart + strongRandomPart;
}

export function fixNumber(num, decimal = 4) {
    return parseFloat(num.toFixed(decimal));
}

export function getSvgParents(svg) {
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

export function calculateScaleAndOffset(element) {
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

export function rotatePoint(point, angle, distance) {
    const radAngle = (angle - 90) * (Math.PI / 180);

    return {
        x: point.x + distance * Math.cos(radAngle),
        y: point.y + distance * Math.sin(radAngle),
    };
}

export function getAngle(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const angle = (Math.atan2(dy, dx) * (180 / Math.PI) + 90) % 360;

    return angle < 0 ? angle + 360 : angle;
}

export function copyToClipboard(text) {
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
