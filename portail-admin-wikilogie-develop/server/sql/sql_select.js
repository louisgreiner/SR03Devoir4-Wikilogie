const connection = require("./db_connection");
const pg = require('pg');
const pool = new pg.Pool(connection);

async function select(table_name, column_names = [], where_conditions = []) {
    /*
    where_conditions = [{
        condition : "";
        operator : ""; //AND, OR, ""
    }]
    */

    query = "SELECT ";
    if (column_names.length > 0) {
        query = query + column_names.join(",");
        query = query + " ";
    } else {
        query = query + "* ";
    }
    query += "FROM " + table_name + " ";
    var len = where_conditions.length;
    if (len > 0) {
        query += "WHERE "
        for (let i = 0; i < len; i++) {
            query += where_conditions[i].condition + " " + where_conditions[i].operator + " ";
        }
    }
    const res = await pool.query(query).then(res => res).catch(err => console.log(err))
    return res;
   }


//select("users")
//select("users", ["login"]);
//select("users", ["login", "email"]);
//select("users", ["login", "email"], [{condition: "login='aiem49'", operator: ""}]);
//select("users", ["login", "email"], [{condition: "login='toto'", operator: ""}]);
//select("users", ["login", "email"], [{condition: "login='aiem49'", operator: "AND"}, {condition: "email='delmernissi49@gmail.com'", operator: ""}]);

module.exports = {
    select,
}