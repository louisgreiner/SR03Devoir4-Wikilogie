const router = require('express').Router();
const {delete_rows} = require('../sql/sql_delete');
const {select} = require('../sql/sql_select');
const {insert} = require('../sql/sql_insert');
const {update} = require('../sql/sql_update');
const { database } = require('../sql/db_connection');

router.post('', async (req, res) => { 
    const { tableName, values, columnNames  } =  req.body;
    try {
        const result = await insert(tableName, values, columnNames);
        res.status(200).send(result.rows);
    }catch(e)
    {
        res.status(500).send(e);
    }
})

router.get('', async (req, res) => {
    const { tableName, columnNames, whereConditions } =  req.query;
        try{
            await select(tableName, columnNames, whereConditions).then((result) => {
            if(result){
                res.status(200).send(result.rows);
            }else{
                res.sendStatus(500);
            }
        });
        }catch(e){
            console.log(e);
        }
})

router.put('', async (req, res) => {
    const { tableName, setStatement, whereConditions } =  req.body;
    try {
        const result = await update(tableName, setStatement, whereConditions);
        res.status(200).send(result.rows);
    }catch(e)
    {
        res.status(500).send(e);
    }
})

router.delete('', async (req, res) => {
    const { tableName, whereConditions } =  req.body;
    try {
        const result = await delete_rows(tableName, whereConditions); 
        res.status(200).send(result.rows);
    }catch(e)
    {
        res.status(500).send(e);
    }
})


module.exports = router