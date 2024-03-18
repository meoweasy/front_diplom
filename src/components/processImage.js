import _ from 'lodash';

export const getVicinVals = (mat, x, y, range) => {
    const width = mat[0].length;
    const height = mat.length;
    const vicinVals = [];
    for (let xx = x - range; xx <= x + range; xx++) {
        for (let yy = y - range; yy <= y + range; yy++) {
            if (xx >= 0 && xx < width && yy >= 0 && yy < height) {
                vicinVals.push(mat[yy][xx]);
            }
        }
    }
    return vicinVals;
};

export const smooth = (mat) => {
    const width = mat[0].length;
    const height = mat.length;
    const simp = [];
    for (let i = 0; i < height; i++) {
        simp[i] = new Array(width);
    }
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const vicinVals = getVicinVals(mat, x, y, 4);
            simp[y][x] = Number(_.chain(vicinVals).countBy().toPairs().maxBy(_.last).head().value());
        }
    }
    return simp;
};

export const neighborsSame = (mat, x, y) => {
    const width = mat[0].length;
    const height = mat.length;
    const val = mat[y][x];
    const xRel = [1, 0];
    const yRel = [0, 1];
    for (let i = 0; i < xRel.length; i++) {
        const xx = x + xRel[i];
        const yy = y + yRel[i];
        if (xx >= 0 && xx < width && yy >= 0 && yy < height) {
            if (mat[yy][xx] !== val) {
                return false;
            }
        }
    }
    return true;
};

export const outline = (mat) => {
    const width = mat[0].length;
    const height = mat.length;
    const line = [];
    for (let i = 0; i < height; i++) {
        line[i] = new Array(width);
    }
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            line[y][x] = neighborsSame(mat, x, y) ? 0 : 1;
        }
    }
    return line;
};

export const getRegion = (mat, cov, x, y) => {
    const covered = _.cloneDeep(cov);
    const region = { value: mat[y][x], x: [], y: [] };
    const queue = [[x, y]];
    while (queue.length > 0) {
        const coord = queue.shift();
        if (covered[coord[1]][coord[0]] === false && mat[coord[1]][coord[0]] === region.value) {
            region.x.push(coord[0]);
            region.y.push(coord[1]);
            covered[coord[1]][coord[0]] = true;
            if (coord[0] > 0) { queue.push([coord[0] - 1, coord[1]]); }
            if (coord[0] < mat[0].length - 1) { queue.push([coord[0] + 1, coord[1]]); }
            if (coord[1] > 0) { queue.push([coord[0], coord[1] - 1]); }
            if (coord[1] < mat.length - 1) { queue.push([coord[0], coord[1] + 1]); }
        }
    }
    return region;
};

export const coverRegion = (covered, region) => {
    for (let i = 0; i < region.x.length; i++) {
        covered[region.y[i]][region.x[i]] = true;
    }
};

export const getLabelLoc = (mat, region) => {
    let bestI = 0;
    let best = 0;
    for (let i = 0; i < region.x.length; i++) {
        const goodness = sameCount(mat, region.x[i], region.y[i], -1, 0) *
            sameCount(mat, region.x[i], region.y[i], 1, 0) *
            sameCount(mat, region.x[i], region.y[i], 0, -1) *
            sameCount(mat, region.x[i], region.y[i], 0, 1);
        if (goodness > best) {
            best = goodness;
            bestI = i;
        }
    }
    return {
        value: region.value,
        x: region.x[bestI],
        y: region.y[bestI]
    };
};

export const getLabelLocs = (mat) => {
    const width = mat[0].length;
    const height = mat.length;
    const covered = [];
    for (let i = 0; i < height; i++) {
        covered[i] = new Array(width);
        _.fill(covered[i], false);
    }
    const labelLocs = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (covered[y][x] === false) {
                const region = getRegion(mat, covered, x, y);
                coverRegion(covered, region);
                if (region.x.length > 100) {
                    labelLocs.push(getLabelLoc(mat, region));
                } else {
                    removeRegion(mat, region);
                }
            }
        }
    }
    return labelLocs;
};

const sameCount = (mat, x, y, incX, incY) => {
    const value = mat[y][x];
    let count = -1;
    while (x >= 0 && x < mat[0].length && y >= 0 && y < mat.length && mat[y][x] === value) {
        count++;
        x += incX;
        y += incY;
    }
    return count;
};

const getBelowValue = (mat, region) => {
    let x = region.x[0];
    let y = region.y[0];
    while (mat[y][x] === region.value) {
        y++;
    }
    return mat[y][x];
};

const removeRegion = (mat, region) => {
    let newValue;
    if (region.y[0] > 0) {
        newValue = mat[region.y[0] - 1][region.x[0]]; // assumes first pixel in list is topmost then leftmost of region.
    } else {
        newValue = getBelowValue(mat, region);
    }
    for (let i = 0; i < region.x.length; i++) {
        mat[region.y[i]][region.x[i]] = newValue;
    }
};

// Функция обработки сообщений от основного потока
const handleMessage = (e) => {
    postMessage({
        cmd: "status",
        status: "smoothing edges..."
    });
    var matSmooth = smooth(e.data.mat);
    postMessage({
        cmd: "status",
        status: "identifying color regions..."
    });
    var labelLocs = getLabelLocs(matSmooth);
    postMessage({
        cmd: "status",
        status: "drawing outline..."
    });
    var matLine = outline(matSmooth);
    postMessage({
        cmd: "result",
        matSmooth: matSmooth,
        labelLocs: labelLocs,
        matLine: matLine
    });
};

// Обработчик сообщений от основного потока
onmessage = handleMessage;

// Экспорт обработчика сообщений
export default handleMessage;