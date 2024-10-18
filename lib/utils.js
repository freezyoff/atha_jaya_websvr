function isDefined(obj){
   return !(obj === undefined || obj === null);
}

function isObject(t){
   return (!!t) && (t.constructor === Object);
}

function isArray(t){
   return (!!t) && (t.constructor === Array);
}

function isString(t){
   return typeof t === 'string' || t instanceof String;
}

function cwdPath(target) {
   return `${process.cwd()}/${target}`;
}

function isDevRuntime(){
   if (!isDefined(process.env.ENV_RUNTIME)){
      process.env.ENV_RUNTIME = "dev";
   }
   return process.env.ENV_RUNTIME == "dev" || 
      process.env.ENV_RUNTIME === "dev";
}

/**
 * check if object contains all keys
 * @param {array} keys - keys to check
 * @param {Object} target - target to check
 */
function isContainKeys(keys, target){
   const defined = isDefined(keys) && isDefined(target);
   if (!defined) return false;

   const isArr = isArray(keys);
   const isObject = (!!target) && (target.constructor === Object);
   if (!isArr || !isObject) return false;

   for (var kk of keys){
      if (!target.hasOwnProperty(kk)) {
         return false;
      }
   }
   return true;
}

module.exports = {
   isDefined, 
   isObject,
   isArray,
   isString,
   cwdPath, 
   isDevRuntime, 
   isContainKeys
}