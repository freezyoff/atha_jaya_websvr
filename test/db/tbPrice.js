const assert = require('assert');
const {TbPrice} = require('./../../lib/db.js');

describe("class TbPrice", ()=>{

   it(`primary keys`, (done)=>{
      assert.equal(TbPrice.primaryKeyColumns().length, 1);
      assert.equal(TbPrice.primaryKeyColumns()[0], 'date');
      done();
   });

   it(`required columns`, (done)=>{
      const required = [
         TbPrice.keyMdseId,
         TbPrice.keyAssocId,
         TbPrice.keyAmmount
      ];
      assert.equal(TbPrice.requiredColumns().length, required.length);
      assert.deepEqual(TbPrice.requiredColumns(), required);
      done();
   });

   it(`all columns`, (done)=>{
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

});