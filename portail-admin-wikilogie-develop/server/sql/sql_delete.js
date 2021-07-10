const connection = require("./db_connection");
const pg = require('pg');
const pool = new pg.Pool(connection);

async function delete_rows(table_name, where_condition){
    var query = "DELETE FROM " + table_name + " WHERE " + where_condition;
    const res = await pool.query(query).then(res => res).catch(err => console.log(err));

    return res;
}

//delete_row("fields", "user_id=3");

module.exports = {
    delete_rows,
}