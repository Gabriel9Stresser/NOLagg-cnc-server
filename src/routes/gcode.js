const express = require('express');
const router = express.Router();
const { gcode, port, portList } = require('../controllers/gcode')
router.route('/').post(gcode);
router.route('/port').post(port);
router.route('/portList').get(portList);
module.exports = router;