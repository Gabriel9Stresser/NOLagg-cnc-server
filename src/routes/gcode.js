const express = require('express');
const router = express.Router();
const { gcode, port } = require('../controllers/gcode')
router.route('/').post(gcode);
router.route('/port').post(port);
module.exports = router;