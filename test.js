const dummy = {name:"x", addr: "xxx", phone: "sdsdsdsd", npwp_nik: "12323"};

const insertCols = ['npwp_nik', 'name', 'addr', 'phone'];
const requiredCols = insertCols.slice(1);   // exclude 'npwp_nik'
let hasRequiredCols = requiredCols.every((i) => dummy.hasOwnProperty(i));

let stmtCols = [];
insertCols.forEach((i, ind)=>{
    if (dummy.hasOwnProperty(i)){
        stmtCols.push(i);
    }
});

let stmtVals = [];
stmtCols.forEach((i, ind)=>{
    stmtVals.push(dummy[i]);
});
console.log(stmtCols);
console.log(stmtVals);