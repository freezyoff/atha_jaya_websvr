const assert = require('assert');
const {sendMockHttpSync, routeString} = require('./../../httpMock.js')

describe(`/all`, ()=>{

   it(`with no data should return 200`, function (done) {
      sendMockHttpSync(routeString("/mdse/all"), null).then((http)=>{
         const json = JSON.parse(http.responseData);
         assert.equal(typeof json, "object");
         assert.equal(200, http.response.statusCode);
         done();
      });
   });

   it(`with any data should return 200`, function (done) {
      sendMockHttpSync(routeString("/mdse/all"), "{}").then((http)=>{
         const json = JSON.parse(http.responseData);
         assert.equal(typeof json, "object");
         assert.equal(200, http.response.statusCode);
         done();
      });
   });

   it(`should return json`, function (done) {
      sendMockHttpSync(routeString("/mdse/all"), {}).then((http)=>{
         const json = JSON.parse(http.responseData);
         assert.equal(typeof json, "object");
         assert.equal(200, http.response.statusCode);
         done();
      })
   });

})