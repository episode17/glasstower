const convert = require('color-convert');

const { randInt } = require('./utils');

function colorwheel(pos) {
    pos = 255 - pos;
    if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
    else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
    else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

function getRandColor() {
    return convert.hsv.rgb(randInt(0, 360), 100, 100);
}

module.exports = {
    colorwheel,
    rgb2Int,
    getRandColor,
};
