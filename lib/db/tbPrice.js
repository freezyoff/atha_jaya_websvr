class TbPrice{
   static keyDate = "date";
   static keyAssocId = "assoc_id";
   static keyAssoc = "assoc";
   static keyMdseId = "mdse_id";
   static keyMdse = "mdse";
   static keyAmmount = "amount";

   static primaryKeyColumns() {
      return [this.keyDate];
   }

   static requiredColumns() {
      return [
         this.keyMdseId,
         this.keyAssocId,
         this.keyAmmount
      ];
   }

   static allColumns(withPK = true) {
      if (withPK){
         return this.primaryKeyColumns().concat(this.requiredColumns());
      }
      return this.requiredColumns();
   }
  
}

module.exports = TbPrice;