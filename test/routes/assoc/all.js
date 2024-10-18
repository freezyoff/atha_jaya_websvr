const assert = require('assert');
const {routeString, sendMockHttpSync} = require('./../../httpMock.js');

describe(`/all`, ()=>{

   it(`with no data should return 200`, function (done) {
      sendMockHttpSync(routeString("/assoc/all"), null).then(http=>{
         assert.equal(200, http.response.statusCode);
         done();
      });
   });

   it(`with any data should return 200`, function (done) {
      sendMockHttpSync(routeString("/assoc/all"), "").then(http=>{
         assert.equal(200, http.response.statusCode);
         done();
      });
   });

   it(`should return json`, function (done) {
      sendMockHttpSync(routeString("/assoc/all"), "{}").then((http)=>{
         const json = JSON.parse(http.responseData);
         assert.equal(typeof json, "object");
         assert.equal(200, http.response.statusCode);
         done();
      })
   });

})