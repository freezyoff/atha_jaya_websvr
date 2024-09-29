const keys = ["a", "b", "c"];
const vals = ["a", "b", "c"];

let result = {};
keys.map((obj, idx)=>{
    result[obj] = vals[idx];
});

console.log(result);