function dbStripQuotes(str){
    return JSON.stringify(str).replace("\\\"", "\"\"");
}

module.exports = {dbStripQuotes};