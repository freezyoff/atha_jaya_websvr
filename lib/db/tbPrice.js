class TbPrice{
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
         this.keyAmmount
      ];
      return withPk? this.primaryKeyColumns().concat(req) : req;
   }

   static allColumns(withPK = true) {
      var all = this.requiredColumns().concat([
         this.keyWeight, 
         this.keyWeightUomAbbr
      ]);
      if (withPK){
         return this.primaryKeyColumns().concat(all);
      }
      return all;
   }
  
}

module.exports = TbPrice;