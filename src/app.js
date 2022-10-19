const express = require('express')
const app = express();
const index = require('./routes/index');
const gcode = require('./routes/gcode');
app.use('/', index);
app.use('/gcode', gcode);
module.exports = app;