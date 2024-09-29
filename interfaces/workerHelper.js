const {HttpRequestPostData} = require('./httpHelper.js');
const Config = require('./../constants.js');

class WorkerData{
    httpPostData;
    config;
    
    /**
     * 
     * @param {HttpRequestPostData} data
     */
    constructor(data){
        if (!(data instanceof HttpRequestPostData)){
            throw new Error("parameter data must be instance of HttpRequestPostData");
        }
        this.httpPostData = data;
        this.config = Object.assign({}, Config);
    }

}

class WorkerResult{
    httpStatusCode;
    err;
    data;

    constructor(statusCode, err, data){
        this.httpStatusCode = statusCode;
        this.err = err;
        this.data = data;
    }
}

module.exports = {
    WorkerData,
    WorkerResult
};