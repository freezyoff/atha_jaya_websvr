function isDefined(obj){
   return !(obj === undefined && obj == null);
}

function cwdPath(target) {
   return `${process.cwd()}/${target}`;
}

module.exports = {isDefined, cwdPath}