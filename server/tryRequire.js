function tryRequire(path) {
    try {
        return require(path);
    } catch (err) {
        // ...
    }
}

module.exports = tryRequire;
