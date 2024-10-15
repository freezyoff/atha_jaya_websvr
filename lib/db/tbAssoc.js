class TbAssoc {
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
}

module.exports = TbAssoc;