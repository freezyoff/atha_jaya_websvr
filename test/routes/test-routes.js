const {routeString} = require('./../httpMock.js')

describe('Test Http Routes', function () {

   require("./uom.js");

   describe(`Test Route ${routeString("/mdse")}`, ()=>{

      require('./mdse/all.js');
      require('./mdse/insert.js');
      require('./mdse/update.js');

   })

   describe(`Test Route ${routeString("/assoc")}`, ()=>{

      require('./assoc/all.js');
      require('./assoc/insert.js');
      require('./assoc/update.js');

   })

   describe(`Test Route ${routeString("/price")}`, ()=>{

      require('./price/all.js');
      require('./price/history.js');
      require('./price/insert.js');

   })

});