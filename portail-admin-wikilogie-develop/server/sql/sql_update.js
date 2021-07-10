const connection = require("./db_connection");
const pg = require('pg');
const pool = new pg.Pool(connection);

async function update(table_name, set_statement, where_condition){
    var query = "UPDATE " + table_name + " SET " + set_statement + " WHERE " + where_condition;
    const res = await pool.query(query).then(res => res).catch(err => console.log(err))
    return res;

}

//update("users", "score=3", "login='aiem49'")

module.exports = {
    update,
}