// intervalManager.js
let intervalId = null;

function getIntervalId() {
    return intervalId;
}

function setIntervalId(id) {
    intervalId = id;
}

function clearIntervalId() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

module.exports = { getIntervalId, setIntervalId, clearIntervalId };
