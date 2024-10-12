const assert = require('assert');
const {TbMdse} = require('./../../lib/db');

describe("class TbMdse", ()=>{

   it(`primary keys`, (done)=>{
      assert.equal(TbMdse.primaryKeyColumns().length, 1);
      assert.equal(TbMdse.primaryKeyColumns()[0], 'id');
      done();
   });

   it(`required columns`, (done)=>{
      const required = [
         TbMdse.keyGroup,
         TbMdse.keyName
      ];
      assert.equal(TbMdse.requiredColumns().length, required.length);
      assert.deepEqual(TbMdse.requiredColumns(), required);
      done();
   });

   it(`all columns`, (done)=>{
      const withPK = [
         TbMdse.keyId,
         TbMdse.keyGroup,
         TbMdse.keyName
      ];
      const withoutPK = [
         TbMdse.keyGroup,
         TbMdse.keyName
      ];
      assert.equal(TbMdse.allColumns().length, withPK.length);
      assert.deepEqual(TbMdse.allColumns(), withPK);
      assert.equal(TbMdse.allColumns(false).length, withoutPK.length);
      assert.deepEqual(TbMdse.allColumns(false), withoutPK);
      done();
   });

});