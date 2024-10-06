const {parentPort, workerData} = require('worker_threads');
const Sqlite3 = require('sqlite3');
const Database = new Sqlite3.Database(workerData.config.dbName);
const {WorkerResult} = require('../../interfaces/workerHelper.js');

const sqlStmt = `
    SELECT 

        /** ASSOC table **/
        ss.id as assoc_id,
        ss.sup_flag as assoc_sup_flag,
        ss.npwp_nik as assoc_nnpwp_nik,
        ss.name as assoc_name,
        ss.addr_street as assoc_addr_street,
        ss.addr_city as assoc_addr_city,
        ss.addr_province as assoc_addr_province,
        ss.addr_zip as assoc_addr_zip,
        ss.phone as assoc_phone,
        ss.pic_phone as assoc_pic_phone,
        
        /** MDSE table **/
        md.id as mdse_id, 
        md.name as mdse_name,
        md."group" as mdse_group,
        
        /** ASSOC_MDSE_PRICES table **/
        max(pp.date) as price_date,
        pp.amount as price_amount
        
    FROM assoc_mdse_prices as pp
    JOIN assoc as ss ON ss.id = pp.assoc_id
    JOIN mdse as md ON md.id = pp.mdse_id

    WHERE ss.id = pp.assoc_id

    Group by ss.id, md.id

    Order By ss.name ASC, md.name asc;
`
Database.all(sqlStmt, [], (err, rows) => {
    if (err) {
        parentPort.postMessage(new WorkerResult(422, "bad query values"));
    }
    else{
        let arr = [];
        for(const item of rows) {
            let res = {};
            for(const el of ["price_date", "price_amount"]){
                const key = el.replace("price_","");
                res[key] = item[el];
            }

            res.mdse = {};
            for(const el of ["mdse_id", "mdse_group", "mdse_name"]){
                const key = el.replace("mdse_","");
                res.mdse[key] = item[el];
            }

            const rr = [
                "assoc_id", "assoc_sup_flag", "assoc_nnpwp_nik",
                "assoc_name", "assoc_addr_street", "assoc_addr_city",
                "assoc_addr_province", "assoc_addr_zip", "assoc_phone",
                "assoc_pic_phone"
            ];

            res.assoc = {};
            for(const el of rr){
                const key = el.replace("assoc_","");
                res.assoc[key] = item[el];
            }

            arr.push(res);
        }
        
        parentPort.postMessage(new WorkerResult(200, null, JSON.stringify(arr)));
    }
});

Database.close();