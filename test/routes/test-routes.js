const { Server } = require('../../lib/http.js');
const {routeString} = require('./../httpMock.js');

describe('Test Http Routes', function () {

   before(function () {
      Server.listen();
   });

   after(function () {
      Server.stop();
   });

   describe(`Test Route ${routeString("/uom")}`, ()=>{
      require("./uom/all.js");
      require("./uom/insert.js");
      require("./uom/update.js");
   });

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
      require('./price/insert.js');
      require('./price/history.js');
   })

});