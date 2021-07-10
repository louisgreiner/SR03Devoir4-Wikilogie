const connection = require("./db_connection");
const pg = require('pg');
const pool = new pg.Pool(connection);

async function insert(table_name, values, column_names=[]){
    var query = "INSERT INTO " + table_name + " ";
    const len = column_names.length;
    if (len > 0){
        query = query + "(";
        query = query + column_names.join(",");
        query = query + ") ";
    }
    query = query + "VALUES (" + values.join(",") + ");";
    const res = await pool.query(query).then(res => res).catch(err => console.log(err));
    return res;
}

//insert("fields", [3, "'mecanic'"]);
//insert("fields", [11, "'mecanic'"], ["user_id", "field"]);

module.exports = {
    insert,
}