function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randArr(arr) {
    const i = randInt(0, arr.length - 1);
    return arr[i];
}

module.exports = {
    randInt,
    randArr,
};
