class HttpRequestPostData {
    url;
    data;

    /**
     * 
     * @param {string} reqUrl 
     * @param {JSON object} postData 
     */
    constructor(reqUrl, postData){
        this.url = reqUrl;
        this.data = postData;
    }
}

module.exports = {
    HttpRequestPostData
};