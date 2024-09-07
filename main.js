const http = require("http");
const url = require("url");
const {Worker} = require('worker_threads');
const Config = require('./constants.js');

const HttpServer = http.createServer((req, res) => {

    var route_tm_s = Date.now();
    const route_elapse = (start) => `${Date.now() - start}ms`

    const handle_route = (worker_name, route_handler)=>{
        const worker = new Worker(route_handler, {workerData: {config: Config, reqUrl: reqUrl, query: parsed.query}});
        worker.on('message', (result) => {
            if (result.httpStatus > 299){
                console.log(Date.now(), `Handle Error: ${reqUrl},`, `code: ${result.httpStatus}`,`msg: ${result.msg}`)
                res.writeHead(result.httpStatus)
            }
            else{
                res.write(result.msg)
                console.log(Date.now(), `Handle Response: ${reqUrl},`, `elapse: ${route_elapse(route_tm_s)}`)
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

        route_tm_s = Date.now();
        console.log(Date.now(), "Handle Request:", reqUrl)

        switch(String(reqUrl)){
            
            case "/mdse/insert":
                handle_route(reqUrl, "./routes/mdse/insert.js"); 
                break;

            case "/mdse/update":
                handle_route(reqUrl, "./routes/mdse/update.js"); 
                break;

            case "/mdse/delete":
                handle_route(reqUrl, "./routes/mdse/delete.js"); 
                break;

            case "/mdse/group_list":
                handle_route(reqUrl, "./routes/mdse/group_list.js"); 
                break;

            case "/assoc_and_cust/insert":
                handle_route(reqUrl, "./routes/assoc_and_cust/insert.js"); 
                break;

            case "/assoc_and_cust/update":
                handle_route(reqUrl, "./routes/assoc_and_cust/update.js"); 
                break;

            case "/assoc_and_cust/delete":
                handle_route(reqUrl, "./routes/assoc_and_cust/delete.js"); 
                break;

            default: 
                handle_route_404(reqUrl);
        }

    }

    // fail other request method
    else{   
        handle_route_404(reqUrl);
    }
})

console.log(Date.now(), "Http Server ready to serve request")
HttpServer.listen(80);