let ENV = require('dotenv').config().parsed;
ENV.SECURE = ENV.SECURE=='1' || ENV.SECURE=='true'

const http = ENV.SECURE? require('https') : require('http');
const httpOptions = {};

const fs = require('fs');
const url = require("url");
const {Worker} = require('worker_threads');
const Config = require('./constants.js');
const {HttpRequestPostData} = require('./interfaces/httpHelper.js');
const {WorkerData} = require('./interfaces/workerHelper.js');

if (ENV.SECURE){
    httpOptions.key = fs.readFileSync(ENV.SECURE_KEY),
    httpOptions.cert = fs.readFileSync(ENV.SECURE_CERT)
}

const HttpServer = http.createServer(httpOptions, (req, res) => {

    var route_tm_s = Date.now();
    const route_elapse = (start) => `${Date.now() - start}ms`;

    const handle_route = function (reqUrl, postData, route_handler) {

        // build WorkerData class
        let workerPostData = new HttpRequestPostData(reqUrl, postData.length > 0 ? JSON.parse(postData) : null);
        let workerData = new WorkerData(workerPostData);
        const worker = new Worker(route_handler, {workerData: workerData});

        worker.on('message', (result) => {
            if (result.httpStatusCode > 299){
                console.log(Date.now(), `Handle Error: ${reqUrl},`, `code: ${result.httpStatusCode}`,`msg: ${result.err}`);
                res.writeHead(result.httpStatusCode);
            }
            else{
                res.writeHead(result.httpStatusCode);
                res.write(result.data);
                console.log(Date.now(), `Handle Response: ${reqUrl},`, `elapse: ${route_elapse(route_tm_s)}`);
            }
            res.end()
        })
        worker.on("error", (msg) => {
            console.log(Date.now(), `Handle Error: ${reqUrl},`, `error: ${msg}`)
            res.writeHead(500)
            res.end()
        })
    }
    const handle_route_404 = (reqUrl) => {
        console.log(Date.now(), `Handle Error: ${reqUrl},`, `error: route not found`)
        res.writeHead(404)
        res.end()
    }

    res.setHeader("Access-Control-Allow-Origin", "*")   // Set our header
    res.setHeader("Accept", "application/json")   // Set our header
    const parsed = url.parse(req.url, true) // Parse the request url
    const reqUrl = parsed.pathname  // Get the path from the parsed URL

    if (req.method == "POST") {

        let route_tm_s = Date.now();
        console.log(Date.now(), "Handle Request:", reqUrl);

        let postData = "";
        req.on("data", function (chunk) {
            postData += chunk;
        });

        req.on("end", function(){
            switch(String(reqUrl)){
                
                case "/mdse/all":
                    handle_route(reqUrl, postData, "./routes/mdse/all.js"); 
                    break;

                case "/mdse/insert":
                    handle_route(reqUrl, postData, "./routes/mdse/insert.js"); 
                    break;
        
                case "/mdse/update":
                    handle_route(reqUrl, postData, "./routes/mdse/update.js"); 
                    break;

                case "/assoc/all":
                    handle_route(reqUrl, postData, "./routes/assoc/all.js"); 
                    break;
        
                case "/assoc/insert":
                    handle_route(reqUrl, postData, "./routes/assoc/insert.js"); 
                    break;
        
                case "/assoc/update":
                    handle_route(reqUrl, postData, "./routes/assoc/update.js"); 
                    break;

                case "/price/all":
                    handle_route(reqUrl, postData, "./routes/price/all.js"); 
                    break;

                case "/price/insert":
                    handle_route(reqUrl, postData, "./routes/price/insert.js"); 
                    break;

                case "/price/history":
                    handle_route(reqUrl, postData, "./routes/price/history.js"); 
                    break;
        
                default: 
                    handle_route_404(reqUrl);
            }
        });

    }

    // fail other request method
    else{   
        handle_route_404(reqUrl);
    }
})

console.log(Date.now(), `Http Server ready to serve request on ${ENV.SECURE? "https://" : "http://"}${ENV.DB_HOST}:${ENV.DB_PORT}`)
HttpServer.listen(ENV.DB_PORT, ENV.DB_HOST);