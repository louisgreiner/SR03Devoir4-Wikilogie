const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello from root !");
})


// ROUTES
const operationsRoutes = require('./routes/operations');
app.use('/operations', operationsRoutes); 


const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log("listening on port: ", PORT)