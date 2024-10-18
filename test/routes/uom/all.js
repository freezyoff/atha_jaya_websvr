const { sendMockHttpSync, routeString } = require('../../httpMock.js');
const assert = require('assert');

describe(`/all`, ()=>{

   it(`with no data should return 200`, function (done) {
      sendMockHttpSync(routeString("/uom/all"), null).then(http=>{
         assert.equal(200, http.response.statusCode);
         done();
      });
   });

   it(`with any data should return 200`, function (done) {
      sendMockHttpSync(routeString("/uom/all"), null).then(http=>{
         assert.equal(200, http.response.statusCode);
               done();
      });
   });

   it(`should return json`, function (done) {
      sendMockHttpSync(routeString("/uom/all"), null).then(http=>{
         const json = JSON.parse(http.responseData);      
         assert.notEqual(0, json.length);
         assert.equal(200, http.response.statusCode);
         done();
      });
   });

})