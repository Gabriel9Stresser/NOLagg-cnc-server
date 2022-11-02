const express = require('express')
var bodyParser = require('body-parser')
const app = express();
const index = require('./routes/index');
const gcode = require('./routes/gcode');
var cors = require('cors')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

// parse application/json
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use('/', index);
app.use('/gcode', gcode);
module.exports = app;