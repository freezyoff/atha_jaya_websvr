const { dbQuotes, dbRun, dbAll } = require("../db");
const { isDefined } = require("../utils");

class TbAssoc {
   static tableName = "assoc";
   static keyId = "id";
   static keyName = "name";
   static keyAddrStreet = "addr_street";
   static keyAddrCity = "addr_city";
   static keyAddrProvince = "addr_province";
   static keyAddrZip = "addr_zip";
   static keyPhone = "phone";
   static keySupplierFlag = "sup_flag";
   static keyNpwpOrNik = "npwp_nik";
   static keyPicName = "pic_name";
   static keyPicPhone = "pic_phone";

   static primaryKeyColumns() {
      return [this.keyId];
   }

   static requiredColumns(withPk = false) {
      var req = [
         this.keyName,
         this.keyAddrStreet,
         this.keyAddrCity,
         this.keyAddrProvince,
         this.keyAddrZip,
         this.keyPhone
      ];
      return withPk? this.primaryKeyColumns().concat(req) : req;
   }

   static allColumns(withPk = true) {
      if (withPk) {
         return this.primaryKeyColumns()
            .concat(this.requiredColumns())
            .concat([
               this.keySupplierFlag,
               this.keyNpwpOrNik,
               this.keyPicName,
               this.keyPicPhone
            ])
      }
      return this.requiredColumns()
         .concat([
            this.keySupplierFlag,
            this.keyNpwpOrNik,
            this.keyPicName,
            this.keyPicPhone
         ])
   }

   /**
    * fetch all rows data from database
    * @param {err | rows} callback - db error or rows result
    */
   static all(callback){
      const sqlStmt = `SELECT * FROM ${this.tableName} order by name asc;`
      dbAll(sqlStmt, (err, rows)=>{
         if (err) callback(err);
         else callback(rows);
      });
   }

   /**
    * fetch all rows data from database
    * @returns db error or rows result
    */
   static allSync(){
      return new Promise(function(resolve){
      TbAssoc.all(result=>{
            resolve(result);
         });
      })
   }

   /**
    * insert single data to database
    * @param {Object} data - mdse data 
    * @param {Error | Object} callback - Db Error or Object{lastID, changes}
    * @see requiredColumns
    */
   static insert(data, callback){
      if (!isDefined(data)){
         data = {};
         for(var key of this.requiredColumns()){
            data[key] = null;
         }
      }
      
      let colStmt = [];
      let valStmt = [];
      for(var key of this.allColumns(false)){
         if (isDefined(data[key])){
            colStmt.push(`${key}`);
            valStmt.push(dbQuotes(data[key]));
         }
      }

      let sqlStmt = `INSERT INTO ${this.tableName} (?) VALUES (?);`;
      sqlStmt = sqlStmt.replace("?", colStmt.join(",")).replace("?", valStmt.join(","));
      dbRun(sqlStmt, function(err, rows){
         if (err) callback(err);
         else callback({lastID: this.lastID, changes: this.changes});
      });
   }

   /**
    * insert single rows to database
    * @param {Object} data - mdse data (@see requiredColumns)
    * @returns Db Error or Object{lastID, changes}
    */
   static insertSync(data){
      return new Promise(resolve=>{
         this.insert(data, function(result){
            resolve(result)
         });
      });
   }

   static update(data, callback){
      let sqlStmt = `UPDATE ${this.tableName} SET ? WHERE ?;`;
      let setStmt = [];
      let whereStmt = [];

      // make set
      for (var key of this.allColumns(false)){
         if (isDefined(data[key])){
            setStmt.push(`[${key}]=${dbQuotes(data[key])}`);
         }
      }

      // make where
      for (var key of this.primaryKeyColumns()){
         if (isDefined(data[key])){
            whereStmt.push(`${key}=${dbQuotes(data[key])}`);
         }
      }

      sqlStmt = sqlStmt.replace("?", setStmt.join(", "))
                        .replace("?", whereStmt.join(" AND "));
      dbRun(sqlStmt, function(err, rows){
         if (err) callback(err);
         else callback({lastID: this.lastID, changes: this.changes});
      });
   }

   static updateSync(data){
      return new Promise(resolve=>{
         TbAssoc.update(data, result=>{
            resolve(result);
         });
      })
   }
}

module.exports = TbAssoc;