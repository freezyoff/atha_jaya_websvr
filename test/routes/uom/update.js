const TbUOM = require('../../../lib/db/tbUOM.js');
const { sendMockHttpSync, routeString } = require('../../httpMock.js');
const assert = require('assert');
const Crypto = require('crypto');

describe(`/update`, ()=>{

   before(async function () {
      uomList = await TbUOM.allSync();
   });

   it(`with no data should return 417`, function (done) {
      sendMockHttpSync(routeString("/uom/update"), null).then(http=>{
         assert.equal(417, http.response.statusCode);
         done();
      });
   });

   it(`with any data should return 417`, function (done) {
      let data = JSON.stringify({});
      sendMockHttpSync(routeString("/uom/update"), data).then(http=>{
         assert.equal(417, http.response.statusCode);
         done();
      });
   });

   it(`should return json`, function (done) {
      let refBaseObj = uomList[Crypto.randomInt(0, uomList.length-1)];
      let data = Object.assign({}, uomList[Crypto.randomInt(0, uomList.length-1)]);
      // data[TbUOM.keyAbbr] = Crypto.randomBytes(2).toString('hex');
      data[TbUOM.keyIsBase] = Crypto.randomInt(0, 1);
      data[TbUOM.keyRefBase] = refBaseObj[TbUOM.keyAbbr];
      data[TbUOM.keyConversion] = Crypto.randomBytes(5).toString('hex');
      sendMockHttpSync(routeString("/uom/update"), data).then(http=>{
         // console.log(http.responseData);
         // const json = JSON.parse(http.responseData);
         // console.log(json);
         // assert.notEqual(0, json.length);
         assert.equal(201, http.response.statusCode);
         done();
      });
   });

})