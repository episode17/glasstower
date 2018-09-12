/* eslint-disable no-console */
const ws281x = require('rpi-ws281x-native');
const convert = require('color-convert');
const throttle = require('throttleit');
const express = require('express');

// const {
//     randInt,
//     randArr,
// } = require('./utils');

const {
    colorwheel,
    rgb2Int,
    // getRandColor,
} = require('./colors');

const PORT = 80;
const NUM_LEDS = 120;
const ZONES = [
    [0, 4],
    [5,  16],
    [17, 28],
    [29, 40],
    [41, 51],
    [52, 61],
    [62, 73],
    [74, 85],
    [86, 97],
    [98, 109],
    [110, 119],
];

let pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);
ws281x.setBrightness(70);

// var offset = 0;
// setInterval(function () {
//     for (var i = 0; i < NUM_LEDS; i++) {
//         pixelData[i] = colorwheel((offset + i) % 256);
//     }
//
//     offset = (offset + 1) % 256;
//     ws281x.render(pixelData);
// }, 1000 / 120);

let last = Date.now();
const interval = 1000 / 20;

let i = ZONES.length - 1;
let j = 0;
let offset = 0;
// let color = getRandColor();

function render() {
    setImmediate(render);

    const now = Date.now();

    if (now < last + interval) {
        return;
    }

    last = now;

    // <rainbow>
    for (let c = 0; c < NUM_LEDS; c++) {
        pixelData[c] = colorwheel((offset + c) % 256);

        // for (let z = ZONES[c][0]; z < ZONES[c][1]; z++) {
        //     pixelData[z] = colorwheel((offset + c) % 256);
        // }
    }

    offset = (offset + 1) % 256;
    // </rainbow>

    // <tower>
    // const [r, g, b] = convert.hsv.rgb(j, 100, 100);
    // pixelData.fill(0);
    //
    // for (let k = 0; k < i + 1; k++) {
    //     for (let z = ZONES[k][0]; z < ZONES[k][1]; z++) {
    //         pixelData[z] = rgb2Int(r, g, b);
    //     }
    // }
    //
    // j += 1;
    //
    // if (j > 360) {
    //     j = 0;
    // }
    // </tower>

    ws281x.render(pixelData);
}

render();

const prevColor = throttle(() => {
    i -= 1;

    if (i < 0) {
        i = -1;
    }
}, 200);

const nextColor = throttle(() => {
    i += 1;

    if (i > ZONES.length - 1) {
        i = ZONES.length - 1;
    }
}, 200);

const api = express.Router();

api.get('/prev', (req, res) => {
    prevColor();
    res.send('OK');
});

api.get('/next', (req, res) => {
    nextColor();
    res.send('OK');
});

const app = express();

app.use(express.static('./client/dist'));
app.use('/api', api);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log('Press <ctrl>+C to exit.');
});

process.on('SIGINT', function () {
    ws281x.reset();
    process.nextTick(() => {
        process.exit(0);
    });
});
