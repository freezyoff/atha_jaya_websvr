const { dbAll, dbQuotes, dbRun } = require("../db");
const { isDefined } = require("../utils");

class TbPrice {
   static tableName = "assoc_mdse_prices";
   static keyDate = "date";
   static keyAssocId = "assoc_id";
   static keyMdseId = "mdse_id";
   static keyAmmount = "amount";
   static keyWeight = "weight";
   static keyWeightUomAbbr = "weight_uom_abbr";

   static keyAssoc = "assoc";
   static keyMdse = "mdse";

   static primaryKeyColumns() {
      return [this.keyDate];
   }

   static requiredColumns(withPk = false) {
      var req = [
         this.keyMdseId,
         this.keyAssocId,
         this.keyAmmount,
      ];
      return withPk ? this.primaryKeyColumns().concat(req) : req;
   }

   static allColumns(withPK = true) {
      var all = this.requiredColumns().concat([this.keyWeight, this.keyWeightUomAbbr]);
      if (withPK) {
         return this.primaryKeyColumns().concat(all);
      }
      return all;
   }

   /**
    * fetch all rows data from database
    * @param {err | rows} callback - db error or rows result
    */
   static latestPrices(callback) {
      const sqlStmt = `
         SELECT 

            /** ASSOC table **/
            ss.id as assoc_id,
            ss.sup_flag as assoc_sup_flag,
            ss.npwp_nik as assoc_nnpwp_nik,
            ss.name as assoc_name,
            ss.addr_street as assoc_addr_street,
            ss.addr_city as assoc_addr_city,
            ss.addr_province as assoc_addr_province,
            ss.addr_zip as assoc_addr_zip,
            ss.phone as assoc_phone,
            ss.pic_phone as assoc_pic_phone,
                  
            /** MDSE table **/
            md.id as mdse_id, 
            md.name as mdse_name,
            md."group" as mdse_group,
                  
            /** ASSOC_MDSE_PRICES table **/
            max(pp.date) as price_date,
            pp.amount as price_amount,
            pp.weight as price_weight,

            /** UOM table **/
            uom.abbr as uom_abbr,
            uom.is_base as uom_is_base,
            uom.ref_base as uom_ref_base,
            uom.conversion as uom_conversion,
            uom.desc as uom_desc

         FROM assoc_mdse_prices as pp
         JOIN assoc as ss ON ss.id = pp.assoc_id
         JOIN mdse as md ON md.id = pp.mdse_id
         JOIN uom ON uom.abbr = pp.weight_uom_abbr

         WHERE ss.id = pp.assoc_id

         Group by ss.id, md.id

         Order By ss.name ASC, md.name ASC;
      `;

      dbAll(sqlStmt, (err, rows) => {
         if (err) {
            callback(err);
            return;
         }

         let arr = [];
         for (const item of rows) {
            let res = {
               uom: {},
               mdse:{},
               assoc:{}
            };

            for (var col in item){

               // ss.id as assoc_id,
               // ss.sup_flag as assoc_sup_flag,
               // ss.npwp_nik as assoc_nnpwp_nik,
               // ss.name as assoc_name,
               // ss.addr_street as assoc_addr_street,
               // ss.addr_city as assoc_addr_city,
               // ss.addr_province as assoc_addr_province,
               // ss.addr_zip as assoc_addr_zip,
               // ss.phone as assoc_phone,
               // ss.pic_phone as assoc_pic_phone,
               if(col.startsWith("assoc_")){
                  let key = col.replace("assoc_", "");
                  res.assoc[key] = item[col];
               }

               // md.id as mdse_id, 
               // md.name as mdse_name,
               // md."group" as mdse_group,
               else if (col.startsWith("mdse_")){
                  let key = col.replace("mdse_", "");
                  res.mdse[key] = item[col];
               }

               // pp.date as price_date,
               // pp.amount as price_amount,
               // pp.weight as price_weight,
               else if(col.startsWith("price_")){
                  let key = col.replace("price_", "");
                  res[key] = item[col];
               }

               // uom.abbr as uom_abbr,
               // uom.is_base as uom_is_base,
               // uom.ref_base as uom_ref_base,
               // uom.conversion as uom_conversion,
               // uom.desc as uom_desc
               else if (col.startsWith("uom_")){
                  let key = col.replace("uom_", "");
                  res.uom[key] = item[col];
               }
            }

            arr.push(res);
         }
         callback(arr);
      });
   }

   /**
    * fetch all rows data from database
    * @returns db error or rows result
    */
   static latestPricesSync() {
      return new Promise(function (resolve) {
         TbPrice.latestPrices(result => {
            resolve(result);
         });
      })
   }

   /**
    * insert single row of data to database
    * @param {object} data - price data (@see allColumns)
    * @param {Error | Object} callback - Db Error or Object{lastID, changes}
    * @see allColumns
    */
   static insert(data, callback) {
      if (!isDefined(data)) {
         data = {};
         for (var key of this.requiredColumns(false)) {
            data[key] = null;
         }
      }

      let colStmt = [];
      let valStmt = [];
      for (var key of this.allColumns(true)) {
         if (isDefined(data[key])) {
            colStmt.push(key);
            valStmt.push(dbQuotes(data[key]));
         }
      }

      let sqlStmt = `INSERT INTO ${this.tableName} (?) VALUES (?)`;
      sqlStmt = sqlStmt.replace("?", colStmt.join(",")).replace("?", valStmt.join(","));
      dbRun(sqlStmt, function (err, rows) {
         if (err) callback(err);
         else callback({ lastID: this.lastID, changes: this.changes });
      });
   }

   static insertSync(data) {
      return new Promise(resolve => {
         TbPrice.insert(data, result => {
            resolve(result);
         });
      });
   }

   static update(data, callback) {
      let sqlStmt = `UPDATE ${this.tableName} SET ? WHERE ?;`;
      let setStmt = [];
      let whereStmt = [];

      // make set
      for (var key of this.allColumns(false)) {
         if (isDefined(data[key])) {
            setStmt.push(`[${key}]=${dbQuotes(data[key])}`);
         }
      }

      // make where
      for (var key of this.primaryKeyColumns()) {
         if (isDefined(data[key])) {
            whereStmt.push(`${key}=${dbQuotes(data[key])}`);
         }
      }

      sqlStmt = sqlStmt.replace("?", setStmt.join(", "))
         .replace("?", whereStmt.join(" AND "));
      dbRun(sqlStmt, function (err, rows) {
         if (err) callback(err);
         else callback({ lastID: this.lastID, changes: this.changes });
      });
   }

   static updateSync(data) {
      return new Promise(resolve => {
         TbPrice.update(data, result => {
            resolve(result);
         });
      })
   }

   /**
    * 
    * @param {Object} data - object contains {assoc_id, mdse_id}
    * @param {Error | Object} callback - Error or result object
    */
   static history(data, callback) {
      let sqlStmt = `
         SELECT 

            /** ASSOC table **/
            ss.id as assoc_id,
            ss.sup_flag as assoc_sup_flag,
            ss.npwp_nik as assoc_nnpwp_nik,
            ss.name as assoc_name,
            ss.addr_street as assoc_addr_street,
            ss.addr_city as assoc_addr_city,
            ss.addr_province as assoc_addr_province,
            ss.addr_zip as assoc_addr_zip,
            ss.phone as assoc_phone,
            ss.pic_phone as assoc_pic_phone,
                  
            /** MDSE table **/
            md.id as mdse_id, 
            md.name as mdse_name,
            md."group" as mdse_group,
                  
            /** ASSOC_MDSE_PRICES table **/
            pp.date as price_date,
            pp.amount as price_amount,
            pp.weight as price_weight,

            /** UOM table **/
            uom.abbr as uom_abbr,
            uom.is_base as uom_is_base,
            uom.ref_base as uom_ref_base,
            uom.conversion as uom_conversion,
            uom.desc as uom_desc

         FROM assoc_mdse_prices as pp
         JOIN assoc as ss ON ss.id = pp.assoc_id
         JOIN mdse as md ON md.id = pp.mdse_id
         JOIN uom ON uom.abbr = pp.weight_uom_abbr

         WHERE ?
         Order By ss.id ASC, md.id asc;
      `;

      const requiredColumns = [this.keyAssocId, this.keyMdseId];

      if (!isDefined(data)) {
         data = {};
         for (var key of requiredColumns) {
            data[key] = null;
         }
      }

      // make where
      let whereStmt = [];
      for (var key of requiredColumns) {
         if (isDefined(data[key])) {
            whereStmt.push(`${key}=${dbQuotes(data[key])}`);
         }
      }

      sqlStmt = sqlStmt.replace("?", whereStmt.join(" AND "));
      dbAll(sqlStmt, function (err, rows) {
         if (err) {
            callback(err);
            return;
         }

         let arr = [];
         for (const item of rows) {
            let res = {
               uom: {},
               mdse:{},
               assoc:{}
            };

            for (var col in item){

               // ss.id as assoc_id,
               // ss.sup_flag as assoc_sup_flag,
               // ss.npwp_nik as assoc_nnpwp_nik,
               // ss.name as assoc_name,
               // ss.addr_street as assoc_addr_street,
               // ss.addr_city as assoc_addr_city,
               // ss.addr_province as assoc_addr_province,
               // ss.addr_zip as assoc_addr_zip,
               // ss.phone as assoc_phone,
               // ss.pic_phone as assoc_pic_phone,
               if(col.startsWith("assoc_")){
                  let key = col.replace("assoc_", "");
                  res.assoc[key] = item[col];
               }

               // md.id as mdse_id, 
               // md.name as mdse_name,
               // md."group" as mdse_group,
               else if (col.startsWith("mdse_")){
                  let key = col.replace("mdse_", "");
                  res.mdse[key] = item[col];
               }

               // pp.date as price_date,
               // pp.amount as price_amount,
               // pp.weight as price_weight,
               else if(col.startsWith("price_")){
                  let key = col.replace("price_", "");
                  res[key] = item[col];
               }

               // uom.abbr as uom_abbr,
               // uom.is_base as uom_is_base,
               // uom.ref_base as uom_ref_base,
               // uom.conversion as uom_conversion,
               // uom.desc as uom_desc
               else if (col.startsWith("uom_")){
                  let key = col.replace("uom_", "");
                  res.uom[key] = item[col];
               }
            }

            arr.push(res);
         }
         callback(arr);
      });
   }

   static historySync(data) {
      return new Promise(resolve => {
         TbPrice.history(data, result => {
            resolve(result);
         });
      });
   }

}

module.exports = TbPrice;