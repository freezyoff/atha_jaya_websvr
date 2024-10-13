const {routeString} = require('./../httpMock.js');
const { execSync } = require('child_process');

describe('Test Http Routes', function () {


   // require("./uom.js");

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

   describe(`Test Route ${routeString("/uom")}`, ()=>{

      require('./uom/all.js');
      // require('./uom/history.js');
      // require('./uom/insert.js');

   })

});