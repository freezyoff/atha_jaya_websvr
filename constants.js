module.exports = {
    dbName: "./atha_jaya.db",

    // use for Worker on postMessage.
    //      `parentPort.postMessage(workerErrorMsg);`
    workerErrorMsg: {httpStatus: 404, msg: ""},
}