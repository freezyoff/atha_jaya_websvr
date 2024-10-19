const assert = require('assert');
const Crypto = require('crypto');
const TbPrice = require('../../lib/db/tbPrice');
const TbAssoc = require('../../lib/db/tbAssoc');
const TbMdse = require('../../lib/db/tbMdse');
const { createPriceMockDataSync } = require('../dbMock');
const { isDbError } = require('../../lib/db');
const { isDefined } = require('../../lib/utils');
const TbUOM = require('../../lib/db/tbUOM');

let mockDataLen = 5;
var priceList = [];
var assocList = [];
var mdseList = [];
describe("class TbPrice", () => {

   before(async function () {
      this.timeout(10000);
      priceList = await createPriceMockDataSync(mockDataLen);
      assocList = await TbAssoc.allSync();
      mdseList = await TbMdse.allSync();
   });

   it(`primaryKeysColumn()`, (done) => {
      assert.equal(TbPrice.primaryKeyColumns().length, 1);
      assert.equal(TbPrice.primaryKeyColumns()[0], 'date');
      done();
   });

   it(`requiredColumns()`, (done) => {
      const required = [
         TbPrice.keyMdseId,
         TbPrice.keyAssocId,
         TbPrice.keyAmmount,
      ];
      assert.equal(TbPrice.requiredColumns().length, required.length);
      assert.deepEqual(TbPrice.requiredColumns(), required);
      done();
   });

   it(`allColumns()`, (done) => {
      const withoutPK = [
         TbPrice.keyMdseId,
         TbPrice.keyAssocId,
         TbPrice.keyAmmount,
         TbPrice.keyWeight,
         TbPrice.keyWeightUomAbbr
      ];
      const withPK = [TbPrice.keyDate].concat(withoutPK);
      assert.equal(TbPrice.allColumns().length, withPK.length);
      assert.deepEqual(TbPrice.allColumns(), withPK);
      assert.equal(TbPrice.allColumns(false).length, withoutPK.length);
      assert.deepEqual(TbPrice.allColumns(false), withoutPK);
      done();
   });

   it(`latestPrices()`, done => {
      TbPrice.latestPrices(result => {
         if (isDbError(result)) throw result;
         assert.equal(typeof result, 'object');
         assert.notEqual(0, result.length);
         done();
      });
   });

   it(`latestPricesSync()`, done => {
      TbPrice.latestPricesSync().then(result => {
         if (isDbError(result)) throw result;
         assert.equal(typeof result, 'object');
         assert.notEqual(0, result.length);
         done();
      });
   });

   describe("insert() ", () => {
      it("with complete required columns", done => {
         let uomList = ['mg', 'g', 'kg', 't'];
         let mdse = mdseList[Crypto.randomInt(0, mdseList.length - 1)];
         let assoc = assocList[Crypto.randomInt(0, assocList.length - 1)];
         let price = {};
         price[TbPrice.keyDate] = new Date().getTime();
         price[TbPrice.keyMdseId] = mdse[TbMdse.keyId];
         price[TbPrice.keyAssocId] = assoc[TbMdse.keyId];
         price[TbPrice.keyAmmount] = Crypto.randomInt(1000, 1000000);
         price[TbPrice.keyWeight] = Crypto.randomInt(1000, 10000);
         price[TbPrice.keyWeightUomAbbr] = uomList[Crypto.randomInt(0, uomList.length - 1)];
         TbPrice.insert(price, result => {
            if (isDbError(result)) throw result;
            assert.equal(false, isDbError(result));
            assert.equal(true, isDefined(result.lastID));
            assert.equal(true, isDefined(result.changes));
            priceList.push(price);
            done();
         });
      });

      it("with incomplete required columns", done => {
         let mdse = mdseList[Crypto.randomInt(0, mdseList.length - 1)];
         let assoc = assocList[Crypto.randomInt(0, assocList.length - 1)];
         let price = {};
         price[TbPrice.keyMdseId] = mdse[TbMdse.keyId];
         price[TbPrice.keyAssocId] = assoc[TbMdse.keyId];
         TbPrice.insert(price, result => {
            assert.equal(true, isDbError(result));
            done();
         });
      });
   });

   describe("insertSync() ", () => {
      it("with complete required columns", done => {
         let uomList = ['mg', 'g', 'kg', 't'];
         let mdse = mdseList[Crypto.randomInt(0, mdseList.length - 1)];
         let assoc = assocList[Crypto.randomInt(0, assocList.length - 1)];
         let price = {};
         price[TbPrice.keyDate] = new Date().getTime();
         price[TbPrice.keyMdseId] = mdse[TbMdse.keyId];
         price[TbPrice.keyAssocId] = assoc[TbMdse.keyId];
         price[TbPrice.keyAmmount] = Crypto.randomInt(1000, 1000000);
         price[TbPrice.keyWeight] = Crypto.randomInt(1000, 10000);
         price[TbPrice.keyWeightUomAbbr] = uomList[Crypto.randomInt(0, uomList.length - 1)];
         TbPrice.insertSync(price).then(result => {
            if (isDbError(result)) throw result;
            assert.equal(false, isDbError(result));
            assert.equal(true, isDefined(result.lastID));
            assert.equal(true, isDefined(result.changes));
            priceList.push(price);
            done();
         });
      });

      it("with incomplete required columns", done => {
         let mdse = mdseList[Crypto.randomInt(0, mdseList.length - 1)];
         let assoc = assocList[Crypto.randomInt(0, assocList.length - 1)];
         let price = {};
         price[TbPrice.keyMdseId] = mdse[TbMdse.keyId];
         price[TbPrice.keyAssocId] = assoc[TbMdse.keyId];

         TbPrice.insertSync(price).then(result => {
            assert.equal(true, isDbError(result));
            done();
         });
      });
   });

   describe("update", () => {

      it(`with complete required columns`, done => {
         let uomList = ['mg', 'g', 'kg', 't'];
         let mdse = mdseList[Crypto.randomInt(0, mdseList.length - 1)];
         let assoc = assocList[Crypto.randomInt(0, assocList.length - 1)];

         let priceRef = priceList[Crypto.randomInt(0, priceList.length - 1)];
         let priceRefUpdated = Object.assign({}, priceRef);
         priceRefUpdated[TbPrice.keyMdseId] = mdse[TbMdse.keyId];
         priceRefUpdated[TbPrice.keyAssocId] = assoc[TbMdse.keyId];
         priceRefUpdated[TbPrice.keyAmmount] = Crypto.randomInt(1000, 1000000);
         priceRefUpdated[TbPrice.keyWeight] = Crypto.randomInt(1000, 10000);
         priceRefUpdated[TbPrice.keyWeightUomAbbr] = uomList[Crypto.randomInt(0, uomList.length - 1)];

         TbPrice.update(priceRefUpdated, result => {
            if (isDbError(result)) throw result;
            assert.equal(false, isDbError(result));
            assert.equal(true, isDefined(result.lastID));
            assert.equal(true, isDefined(result.changes));
            done();
         });
      });

      it(`with incomplete required columns`, done => {
         let uomList = ['mg', 'g', 'kg', 't'];
         let mdse = mdseList[Crypto.randomInt(0, mdseList.length - 1)];
         let assoc = assocList[Crypto.randomInt(0, assocList.length - 1)];

         let priceRef = priceList[Crypto.randomInt(0, priceList.length - 1)];
         let priceRefUpdated = Object.assign({}, priceRef);
         priceRefUpdated[TbPrice.keyMdseId] = mdse[TbMdse.keyId];
         priceRefUpdated[TbPrice.keyAssocId] = assoc[TbMdse.keyId];
         priceRefUpdated[TbPrice.keyAmmount] = Crypto.randomInt(1000, 1000000);
         priceRefUpdated[TbPrice.keyWeight] = Crypto.randomInt(1000, 10000);
         priceRefUpdated[TbPrice.keyWeightUomAbbr] = uomList[Crypto.randomInt(0, uomList.length - 1)];

         delete priceRefUpdated[TbPrice.keyDate];

         TbPrice.update(priceRefUpdated, result => {
            assert.equal(true, isDbError(result));
            done();
         });
      });

   })

   describe("updateSync", () => {

      it(`with complete required columns`, done => {
         let uomList = ['mg', 'g', 'kg', 't'];
         let mdse = mdseList[Crypto.randomInt(0, mdseList.length - 1)];
         let assoc = assocList[Crypto.randomInt(0, assocList.length - 1)];

         let priceRef = priceList[Crypto.randomInt(0, priceList.length - 1)];
         let priceRefUpdated = Object.assign({}, priceRef);
         priceRefUpdated[TbPrice.keyMdseId] = mdse[TbMdse.keyId];
         priceRefUpdated[TbPrice.keyAssocId] = assoc[TbMdse.keyId];
         priceRefUpdated[TbPrice.keyAmmount] = Crypto.randomInt(1000, 1000000);
         priceRefUpdated[TbPrice.keyWeight] = Crypto.randomInt(1000, 10000);
         priceRefUpdated[TbPrice.keyWeightUomAbbr] = uomList[Crypto.randomInt(0, uomList.length - 1)];
         TbPrice.updateSync(priceRefUpdated).then(result => {
            if (isDbError(result)) throw result;
            assert.equal(false, isDbError(result));
            assert.equal(true, isDefined(result.lastID));
            assert.equal(true, isDefined(result.changes));
            done();
         });
      });

      it(`with incomplete required columns`, done => {
         let uomList = ['mg', 'g', 'kg', 't'];
         let mdse = mdseList[Crypto.randomInt(0, mdseList.length - 1)];
         let assoc = assocList[Crypto.randomInt(0, assocList.length - 1)];

         let priceRef = priceList[Crypto.randomInt(0, priceList.length - 1)];
         let priceRefUpdated = Object.assign({}, priceRef);
         priceRefUpdated[TbPrice.keyMdseId] = mdse[TbMdse.keyId];
         priceRefUpdated[TbPrice.keyAssocId] = assoc[TbMdse.keyId];
         priceRefUpdated[TbPrice.keyAmmount] = Crypto.randomInt(1000, 1000000);
         priceRefUpdated[TbPrice.keyWeight] = Crypto.randomInt(1000, 10000);
         priceRefUpdated[TbPrice.keyWeightUomAbbr] = uomList[Crypto.randomInt(0, uomList.length - 1)];

         delete priceRefUpdated[TbPrice.keyDate];

         TbPrice.updateSync(priceRefUpdated).then(result => {
            assert.equal(true, isDbError(result));
            done();
         });
      });

   })

   describe("history()", () => {

      it("with complete required columns", done => {
         let price = priceList[Crypto.randomInt(0, priceList.length - 1)];
         let tmp = {};
         tmp[TbPrice.keyAssocId] = price[TbPrice.keyAssocId];
         tmp[TbPrice.keyMdseId] = price[TbPrice.keyMdseId];
         TbPrice.history(tmp, result => {
            assert.equal(false, isDbError(result));
            assert.equal(typeof result, 'object');
            done();
         });
      })

      it("with incomplete required columns", done => {
         let price = priceList[Crypto.randomInt(0, priceList.length - 1)];
         let tmp = {};
         TbPrice.history(tmp, result => {
            assert.equal(true, isDbError(result));
            done();
         });
      })

   });

   describe(`historySync()`, () => {
      it("with complete required columns", done => {
         let price = priceList[Crypto.randomInt(0, priceList.length - 1)];
         let tmp = {};
         tmp[TbPrice.keyAssocId] = price[TbPrice.keyAssocId];
         tmp[TbPrice.keyMdseId] = price[TbPrice.keyMdseId];
         TbPrice.historySync(tmp).then(result => {
            assert.equal(false, isDbError(result));
            assert.equal(typeof result, 'object');
            done();
         });
      })

      it("with incomplete required columns", done => {
         let price = priceList[Crypto.randomInt(0, priceList.length - 1)];
         let tmp = {};
         TbPrice.historySync(tmp).then(result => {
            assert.equal(true, isDbError(result));
            done();
         });
      })
   });

   describe(`delete()`, () => {
      it("with complete required columns", done => {
         let price = priceList[Crypto.randomInt(0, priceList.length - 1)];
         let tmp = {};
         TbPrice.delete(price, result => {
            assert.equal(false, isDbError(result));
            // assert.equal(true, isDefined(result.changes));
            done();
         });
      });

      it("with incomplete required columns", done => {
         TbPrice.delete({}, result => {
            assert.equal(true, isDbError(result));
            done();
         });
      })
   });

   describe(`delete()`, () => {
      it("with complete required columns", done => {
         let price = priceList[Crypto.randomInt(0, priceList.length - 1)];
         let tmp = {};
         TbPrice.deleteSync(price).then(result => {
            assert.equal(false, isDbError(result));
            // assert.equal(true, isDefined(result.changes));
            done();
         });
      });

      it("with incomplete required columns", done => {
         TbPrice.deleteSync({}).then(result => {
            assert.equal(true, isDbError(result));
            done();
         });
      })
   });

});