const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT;
const router=require("./route");
const dbConnect = require('./config/db');
dbConnect()
app.use(express.json())
app.use(router)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})