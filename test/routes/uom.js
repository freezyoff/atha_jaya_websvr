const { Server } = require('./../../lib/http.js');
const assert = require('assert');
const http = require('http');

describe("Test Route 'UOM':", ()=>{
   before(function () {
      Server.listen();
   });

   it(`http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/uom/all => `, function (done) {
      this.timeout(5000);
      var postOpt = {
         host: 'localhost',
         port: '80',
         path: '/uom/all',
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Content-Length': 0
         }
      };
   
      const req = http.request(postOpt, function (res) {
         res.setEncoding("utf8");
         // res.on('data', (chunk) => {
         //    body += chunk;
         // });
         // res.on('end', ()=>{
         //    console.log(body);
         // })
         assert.equal(200, res.statusCode, "code=200");
         done();
      });
      // req.on('error', (error) => {
      //    console.error('Error:', error.message);
      //  });
      // req.write("");
      req.end();
   });

   after(function () {
      Server.stop();
   });
})