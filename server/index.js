/* eslint-disable no-console */
const tryRequire = require('./tryRequire');

const ws281x = tryRequire('rpi-ws281x-native');

const http = require('http');
const httpProxy = require('http-proxy');
const express = require('express');
const WebSocket = require('ws');
// const convert = require('color-convert');
const throttle = require('throttleit');

// const {
//     randInt,
//     randArr,
// } = require('./utils');

const {
    colorwheel,
    // rgb2Int,
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

let i = ZONES.length - 1;
// let j = 0;
let offset = 0;
// let color = getRandColor();

let pixelData = new Uint32Array(NUM_LEDS);

if (ws281x) {
    ws281x.init(NUM_LEDS);
    ws281x.setBrightness(255);

    let last = Date.now();
    const interval = 1000 / 20;

    const render = () => {
        setImmediate(render);

        const now = Date.now();

        if (now < last + interval) {
            return;
        }

        last = now;

        // <rainbow>
        // for (let c = 0; c < NUM_LEDS; c++) {
        //     pixelData[c] = colorwheel((offset + c) % 256);
        //
        //     // for (let z = ZONES[c][0]; z < ZONES[c][1]; z++) {
        //     //     pixelData[z] = colorwheel((offset + c) % 256);
        //     // }
        // }
        //
        // offset = (offset + 1) % 256;
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

        // <socket>
        // const [r, g, b] = convert.hsv.rgb(j, 100, 100);
        // pixelData.fill(0);

        // for (let k = 0; k < i + 1; k++) {
        //     for (let z = ZONES[k][0]; z < ZONES[k][1]; z++) {
        //         pixelData[z] = rgb2Int(r, g, b);
        //     }
        // }
        // </socket>

        ws281x.render(pixelData);
    };

    render();
}

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

// api
const api = express.Router();

api.get('/prev', (req, res) => {
    prevColor();
    res.send('OK');
});

api.get('/next', (req, res) => {
    nextColor();
    res.send('OK');
});


// http
const app = express();
const server = http.createServer(app);
// const proxy = httpProxy.createProxyServer({
//     target: 'http://localhost:8080'
// });

app.use((req, res, next) => {
    console.log(`Server: new request (${req.url})`);
    next();
});
app.use(express.static('../client/public'));
app.use('/api', api);
// app.use((req, res) => proxy.web(req, res));

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log('Press <ctrl>+C to exit.');
});

// websocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (socket, req) => {
    const ip = req.connection.remoteAddress;
    console.log(`WSS: new connection (${ip})`);

    socket.on('message', ([index, color]) => {
        for (let i = ZONES[index][0]; i < ZONES[index][1]; i++) {
            pixelData[i] = rgb2Int(...color);
        }

        console.log('received: %s', message);
    });
});

process.on('SIGINT', () =>   {
    if (ws281x) {
        ws281x.reset();
    }

    wss.clients.forEach(socket => {
        socket.terminate();
    })

    process.nextTick(() => {
        process.exit();
    });
});
