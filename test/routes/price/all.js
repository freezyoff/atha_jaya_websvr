const assert = require('assert');
const { routeString, sendMockHttpSync } = require('./../../httpMock.js')

describe(`/all`, () => {

   it(`with no data should return 200`, function (done) {
      sendMockHttpSync(routeString("/price/all"), null).then(http=>{
         assert.equal(200, http.response.statusCode);
         done();
      })
   });

   it(`with any data should return 200`, function (done) {
      sendMockHttpSync(routeString("/price/all"), null).then(http=>{
         assert.equal(200, http.response.statusCode);
         done();
      })
   });

   it(`should return 200 & json object`, function (done) {
      sendMockHttpSync(routeString("/price/all"), null).then(http=>{
         const json = JSON.parse(http.responseData);
         assert.notEqual(0, json.length);
         assert.equal(200, http.response.statusCode);
         done();
      })
   })
})