/* eslint-disable no-console */
const http = require('http');
const fs = require('fs');
const ws281x = require('rpi-ws281x-native');
const convert = require('color-convert');
const throttle = require('throttleit');

// const {
//     randInt,
//     randArr,
// } = require('./utils');

const {
    // colorwheel,
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
const interval = 1000 / 5;

let i = ZONES.length - 1;
let j = 0;
// let color = getRandColor();

function render() {
    setImmediate(render);

    const now = Date.now();

    if (now < last + interval) {
        return;
    }

    last = now;

    // const zone = randArr(ZONES);
    // const zone = ZONES[i];

    const [r, g, b] = convert.hsv.rgb(j, 100, 100);
    pixelData.fill(0);

    // for (let i = zone[0]; i < zone[1]; i++) {
    //     pixelData[i] = rgb2Int(r, g, b);
    // }

    for (let k = 0; k < i + 1; k++) {
        for (let z = ZONES[k][0]; z < ZONES[k][1]; z++) {
            pixelData[z] = rgb2Int(r, g, b);
        }
    }

    ws281x.render(pixelData);

    j += 1;

    if (j > 360) {
        j = 0;
    }

    // color = getRandColor();
}

render();

const prevColor = throttle(() => {
    i -= 1;

    if (i < 0) {
        // i = ZONES.length - 1;
        i = -1;
    }
}, 100);

const nextColor = throttle(() => {
    i += 1;

    if (i > ZONES.length - 1) {
        // i = 0;
        i = ZONES.length - 1;
    }
}, 100);

const extTypes = {
    js: 'text/javascript',
    html: 'text/html',
};

function serveFile(path, req, res) {
    if (path === '/') {
        path = '/index.html';
    }

    fs.readFile(`./public${path}`, function (err, content) {
        if (err) {
            res.writeHead(500);
            res.end(res.statusMessage);
        } else {
            const ext = path.split('.').pop();
            const type = extTypes[ext] || 'text/plain';

            res.writeHead(200, {
                'Content-Type': type,
            });
            res.end(content);
        }
    });
}

const files = [
    '/',
    '/client.js',
];

const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
        res.writeHead(204);
        res.end();
    } else if (files.includes(req.url)) {
        serveFile(req.url, req, res);
    } else {
        let status = 200;

        switch (req.url) {
            case '/prev':
                prevColor();
                break;
            case '/next':
                nextColor();
                break;
            default:
                status = 404;
        }

        res.writeHead(status);
        res.end(res.statusMessage);
    }
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log('Press <ctrl>+C to exit.');
});

process.on('SIGINT', function () {
    ws281x.reset();
    process.nextTick(() => {
        process.exit(0);
    });
});
