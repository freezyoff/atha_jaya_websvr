function isDevRuntime(){
   return process.env.ENV_RUNTIME == "dev" || 
      process.env.ENV_RUNTIME === "dev";
}

// console.log("isDevRuntime()", isDevRuntime());
// console.log("ENV_RUNTIME", process.env.ENV_RUNTIME);

class HttpRouteReq {
   static keyUserToken = "user-token";

   // http request URL
   url = null;


   userToken = null;

   // http post data
   data = null;

   // timetamp created
   tm_start = null;

   /**
    * 
    * @param {url, userToken, data} options 
    */
   constructor(options) {
      if (typeof options !== "object") {
         throw new Error("options should type of object");
      }

      if (options.hasOwnProperty('url')) this.url = options.url;
      if (options.hasOwnProperty('userToken')) this.userToken = options.userToken;
      if (options.hasOwnProperty('data')) this.data = options.data;

      this.tm_start = Date.now();
   }
}

class HttpRouteResp {
   static keyUserToken = "user-token";

   /**
    * response code
    */
   code = null;

   /**
    * response data
    */
   data = null;

   /**
    * response user token
    */
   userToken = null;

   /**
    * error
    */
   err = null;

   /**
    * 
    * @param {
    *   code: http status code,
    *   data: json data,
    *   err: if any error
    *   userToken: new user token
    * } options 
    */
   constructor(options) {
      if (typeof options !== "object") {
         throw new Error("options should type of object");
      }

      if (options.hasOwnProperty('code')) this.code = options.code;
      if (options.hasOwnProperty('userToken')) this.userToken = options.userToken;
      if (options.hasOwnProperty('data')) this.data = options.data;
      if (options.hasOwnProperty('err')) this.err = options.err;
   }
}

class HttpRouteResult {
   /**
    * Class HttpRouteReq
    */
   request = null;

   /**
    * class HttpRouteResp
    */
   response = null;


   /**
    * 
    * @param {HttpRouteReq} request 
    * @param {HttpRouteResp} response 
    */
   constructor(request, response) {
      this.request = request;
      this.response = response;
   }
}

/**
 * 
 * @param {array} keys - required query keys
 * @param {Map} query - http query values
 */
function validateQuery(keys, query) {
   let invalid = keys == null || query == null;
   if (invalid) {
      return false;
   }
   return keys.every((i) => {
      return query.hasOwnProperty(i);
   });
}

const Fs = require('fs');
const { Worker } = require('worker_threads');
const Url = require("url");

const serverImpl_tm_elapsed = function (start) { return `${Date.now() - start}ms`; }

const serverImpl_handleRoute = function (reqUrl, svrResp, worker) {

   worker.on('message', (result) => {
      svrResp.writeHead(result.response.code);

      if (result.response.err) {
         if (isDevRuntime()) {
            console.log(
               Date.now(),
               `Handle Error: ${result.request.url},`,
               `elapse: ${serverImpl_tm_elapsed(result.request.tm_start)},`,
               `code: ${result.response.code},`,
               `msg: ${result.response.err}`
            );
         }
      }
      else {
         svrResp.write(result.response.data ? result.response.data : "");
         if (isDevRuntime()) {
            console.log(
               Date.now(),
               `Handle Response: ${result.request.url},`,
               `elapse: ${serverImpl_tm_elapsed(result.request.tm_start)},`,
               `code: ${result.response.code}`,
            );
         }
      }
      svrResp.end()
   })

   worker.on("error", (msg) => {
      if (isDevRuntime()) {
         console.log(
            Date.now(),
            `Handle Error: ${reqUrl},`,
            `error: ${msg}`
         );
      }
      svrResp.writeHead(500)
      svrResp.end()
   })

}

const serverImpl_handleRoute404 = (reqUrl, svrResp) => {
   if (isDevRuntime()) {
      console.log(Date.now(), `Handle Error: ${reqUrl},`, `error: route not found`)
   }
   svrResp.writeHead(404)
   svrResp.end()
}

const serverImpl_handleRoute417 = (reqUrl, svrResp) => {
   if (isDevRuntime()) {
      console.log(Date.now(), `Handle Error: ${reqUrl},`, `error: invalid json format`)
   }
   svrResp.writeHead(417)
   svrResp.end()
}


/**
 * check if required to use Https
 */
const isSecureHttp = process.env.HTTP_SECURE == 'true'
const { createServer } = isSecureHttp ? require('https') : require('http');

const httpOptions = {};
if (isSecureHttp) {
   httpOptions.key = Fs.readFileSync(process.env.HTTP_PRIVATE_KEY);
   httpOptions.cert = Fs.readFileSync(process.env.HTTP_CERTIFICATE);
}

const postData = {};
const serverImpl = createServer(httpOptions, (svrReq, svrResp) => {

   // Set our header
   svrResp.setHeader("Access-Control-Allow-Origin", "*")
   svrResp.setHeader("Accept", "application/json")

   const parsed = Url.parse(svrReq.url, true) // Parse the request url
   const reqUrl = parsed.pathname          // Get the path from the parsed URL

   // Handle only POST method
   if (svrReq.method != "POST") {
      serverImpl_handleRoute404(reqUrl, svrResp);
      return;
   }

   const postDataKey = Date.now();
   postData[postDataKey] = "";

   svrReq.on("data", function (chunk) {
      postData[postDataKey] += chunk;
   });

   svrReq.on("end", function () {
      const target = `${__dirname}/routes/${reqUrl}.js`

      if (Fs.existsSync(target)) {
         try {
            const routeReq = new HttpRouteReq({
               url: reqUrl,
               data: postData[postDataKey].length > 0 ? JSON.parse(postData[postDataKey]) : null,
               userToken: svrReq.headers[HttpRouteReq.keyUserToken] ?? null
            });

            const worker = new Worker(`${__dirname}/routes/${reqUrl}.js`, { workerData: routeReq });
            serverImpl_handleRoute(reqUrl, svrResp, worker);
         }
         catch (err) {
            serverImpl_handleRoute417(reqUrl, svrResp);
         }
      }
      else {
         serverImpl_handleRoute404(reqUrl, svrResp);
      }

      delete (postData[postDataKey]);
   });

});

const serverImpl_listen = function () {
   if (isDevRuntime()) {
      console.log("")
      console.log(Date.now(), "Use ENV_RUNTIME","=",process.env.ENV_RUNTIME)
      console.log(Date.now(), "Use HTTP_HOST","=",process.env.HTTP_HOST)
      console.log(Date.now(), "Use HTTP_PORT","=",process.env.HTTP_PORT)
      console.log(Date.now(), "Use DB_PATH","=",process.env.DB_PATH)
      console.log(Date.now(), `Http Server ready to serve request on ${isSecureHttp ? "https://" : "http://"}${process.env.HTTP_HOST}:${process.env.HTTP_PORT}`)
   }
   serverImpl.listen(process.env.HTTP_PORT, process.env.HTTP_HOST);
}

const serverImpl_stop = function () {
   serverImpl.close();
}

module.exports = {
   HttpRouteReq,
   HttpRouteResp,
   HttpRouteResult,
   validateQuery,
   Server: {
      listen: serverImpl_listen,
      stop: serverImpl_stop
   },
};