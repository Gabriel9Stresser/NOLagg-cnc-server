var img2gcode = require("img2gcode");
var SerialPort = require('serialport');
const path = require('path');
var LineByLineReader = require('line-by-line');
const fs = require('fs');
var base64Img = require('base64-img');

var serial_port = 'COM3';

function startSerialTransmission(data) {
  var baud = 115200;
  var serial = new SerialPort.SerialPort({path: serial_port, baudRate: baud});
  lineByLine = new LineByLineReader('src/controllers/gcodes/no-lagg.gcode');

  serial.on("open", function() {
    lineByLine.on('line', function(line) {
        console.log(line.split(":")[0])
        serial.write(line + "\n");
    });
  });
}


exports.port = async (req, res, next) => {
  let port = req.body.port;
  var img = req.body.image;

  base64Img.imgSync(img, __dirname + "/gcodes", 'no-lagg');

  res.status(201).send('Requisição recebida com sucesso!');
}

exports.gcode = async (req, res, next) => {
  const dirPath = path.join(__dirname, '/gcodes/no-lagg.jpg');

  const options = {
    // It is mm
    toolDiameter: 0.1,
    sensitivity: 0.1, // intensity sensitivity
    scaleAxes: 10, // default: image.height equal mm 508 x 584.2 i have it at 50
    feedrate: {
      work: 1200,
      idle: 3000
    }, // Only the corresponding line is added.
    deepStep: -1, // default: -1
    // invest: {x:true, y: false},
    whiteZ: 0, // default: 0
    blackZ: -3,
    safeZ: 1,
    info: "console", // ["none" | "console" | "emitter"] default: "none"
    dirImg: dirPath,
  };

  img2gcode
    .start(options)
    .on("log", str => console.log(str))
    .then(data => {
      startSerialTransmission(data)
    });
  res.status(201).send('Requisição recebida com sucesso!');
}