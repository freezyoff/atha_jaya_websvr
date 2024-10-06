function dbStripQuotes(str){
    return JSON.stringify(str).replace(/\\\"/g, `\"\"`);
}

module.exports = {dbStripQuotes};