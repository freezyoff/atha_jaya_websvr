const Crypto = require('crypto');
const TbMdse = require("../lib/db/tbMdse");
const TbAssoc = require('../lib/db/tbAssoc');
const { dbRun, isDbError } = require('../lib/db');
const TbPrice = require('../lib/db/tbPrice');
const TbUOM = require('../lib/db/tbUOM');

async function createMdseMockData(howManyRows = 4, callback) {
   let res = [];
   for (var idx = 0; idx < howManyRows; idx++) {
      let item = {};
      item[TbMdse.keyGroup] = Crypto.randomBytes(3).toString('hex');
      item[TbMdse.keyName] = Crypto.randomBytes(5).toString('hex');
      res.push(item);
      let insertResult = await TbMdse.insertSync(item);
      res[idx][TbMdse.keyId] = insertResult.lastID;
   }

   callback(res);
}

/**
 * 
 * @param {int} howManyRows - rows to generate
 * @returns 
 */
function createMdseMockDataSync(howManyRows = 4){
   return new Promise(resolve=>{
      createMdseMockData(howManyRows, result=>{
         resolve(result);
      })
   })
}

async function createAssocMockData(howManyRows = 4, callback) {
   let mockData = [];
   for (var idx = 0; idx < howManyRows; idx++) {
      let item = {};
      item[TbAssoc.keyName] = Crypto.randomBytes(5).toString('hex');
      item[TbAssoc.keyAddrStreet] = Crypto.randomBytes(10).toString('hex');
      item[TbAssoc.keyAddrCity] = Crypto.randomBytes(5).toString('hex');
      item[TbAssoc.keyAddrProvince] = Crypto.randomBytes(5).toString('hex');
      item[TbAssoc.keyAddrZip] = Crypto.randomInt(10000, 1000000);
      item[TbAssoc.keyPhone] = Crypto.randomInt(10000000000, 1000000000000);
      item[TbAssoc.keySupplierFlag] = Crypto.randomInt(0, 1);
      item[TbAssoc.keyNpwpOrNik] = Crypto.randomInt(10000000000, 1000000000000);
      item[TbAssoc.keyPicName] = Crypto.randomBytes(5).toString('hex');
      item[TbAssoc.keyPicPhone] = Crypto.randomInt(10000000000, 1000000000000);
      mockData.push(item);
      let insertResult = await TbAssoc.insertSync(item);
      mockData[idx][TbAssoc.keyId] = insertResult.lastID;
   }
   callback(mockData);
}

/**
 * 
 * @param {int} howManyRows - rows to generate
 * @returns 
 */
function createAssocMockDataSync(howManyRows = 4){
   return new Promise(resolve=>{
      createAssocMockData(howManyRows, result=>{
         resolve(result);
      })
   })
}

async function createPriceMockData(howManyRows = 4, callback){
   let mdseList = await createMdseMockDataSync(howManyRows);
   let assocList = await createAssocMockDataSync(howManyRows);
   let uomList = ['mg', 'g', 'kg', 't'];
   let priceList = [];
   for (var i=0; i<howManyRows; i++){
      let price = {};
      let mdse = mdseList[Crypto.randomInt(0, howManyRows-1)];
      let assoc = assocList[Crypto.randomInt(0, howManyRows-1)];
      price[TbPrice.keyDate] = new Date().getTime();
      price[TbPrice.keyMdseId] = mdse[TbMdse.keyId];
      price[TbPrice.keyAssocId] = assoc[TbAssoc.keyId];
      price[TbPrice.keyAmmount] = Crypto.randomInt(1000, 1000000);
      price[TbPrice.keyWeight] = Crypto.randomInt(1000, 10000);
      price[TbPrice.keyWeightUomAbbr] = uomList[Crypto.randomInt(0,uomList.length-1)];

      let inserted = await TbPrice.insertSync(price);
      if (isDbError(inserted)) {
         throw inserted;
      }
      else {
         priceList.push(price);
      }
   }
   callback(priceList);
}

function createPriceMockDataSync(howManyRows = 4){
   return new Promise(resolve=>{
      createPriceMockData(howManyRows, result=>{
         resolve(result);
      });
   })
}

module.exports = { 
   createMdseMockData,
   createMdseMockDataSync,
   createAssocMockData,
   createAssocMockDataSync,
   createPriceMockData,
   createPriceMockDataSync
};