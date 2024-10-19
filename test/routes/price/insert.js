const assert = require('assert');
const { routeString, sendMockHttpSync } = require('./../../httpMock.js');
const TbAssoc = require('../../../lib/db/tbAssoc.js');
const TbMdse = require('../../../lib/db/tbMdse.js');
const Crypto = require('crypto');
const TbUOM = require('../../../lib/db/tbUOM.js');
const TbPrice = require('../../../lib/db/tbPrice.js');

let assocList = [];
let mdseList = [];
let uomList = [];

describe(`/insert`, () => {

   before(async function () {
      assocList = await TbAssoc.allSync();
      mdseList = await TbMdse.allSync();
      uomList = await TbUOM.allSync();
   });

   it(`with no data should return 417`, function (done) {
      sendMockHttpSync(routeString("/price/insert"), null).then( http =>{
         assert.equal(417, http.response.statusCode);
         done();
      });
   });

   it(`with any data should return 417`, function (done) {
      var tmp = {};
      tmp[TbPrice.keyWeight] = 10;
      tmp[TbPrice.keyWeightUomAbbr] = 'mg';
      sendMockHttpSync(routeString("/price/insert"), {}).then( http =>{
         assert.equal(417, http.response.statusCode);
         done();
      });
   });

   it(`with complete data should return 201 & json data`, function (done) {
      let assoc = assocList[Crypto.randomInt(0, assocList.length-1)];
      let mdse = mdseList[Crypto.randomInt(0, mdseList.length-1)];
      let uom = uomList[Crypto.randomInt(0, uomList.length-1)];
      let mock = {};
      mock[TbPrice.keyDate] = new Date().getTime();
      mock[TbPrice.keyAssocId] = assoc[TbAssoc.keyId];
      mock[TbPrice.keyMdseId] = mdse[TbMdse.keyId];
      mock[TbPrice.keyAmmount] = Crypto.randomInt(1000, 1000000);
      mock[TbPrice.keyWeight] = Crypto.randomInt(1000, 1000000);
      mock[TbPrice.keyWeightUomAbbr] = uom[TbUOM.keyAbbr];

      sendMockHttpSync(routeString("/price/insert"), mock).then( http =>{
         const json = JSON.parse(http.responseData);
         assert.deepEqual(mock, json);
         assert.equal(201, http.response.statusCode);
         done();
      });
   })
})