var img2gcode = require("img2gcode");
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
const path = require('path');
var LineByLineReader = require('line-by-line');
const fs = require('fs');
var base64Img = require('base64-img');
var ProgressBar = require("progress"); // npm install progress
var bar = new ProgressBar("Analyze: [:bar] :percent :etas", { total: 100 });

var serial_port = 'COM5';

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
  serial_port = port;

  res.status(201).send('Requisição recebida com sucesso!');
}

exports.portList = async (req, res, next) => {
  const serialList = await SerialPort.list();

  res.status(201).send(serialList);
}


exports.gcode = async (req, res, next) => {
  let port = req.body.port;
  
  const dirPath = path.join(__dirname, '/gcodes/no-lagg.jpg');

  const options = {
    // It is mm
    toolDiameter: 0.1,
    sensitivity: 0.2, // intensity sensitivity
    scaleAxes: 25, // default: image.height equal mm 508 x 584.2 i have it at 50
    feedrate: {
      work: 1200,
      idle: 3000
    }, // Only the corresponding line is added.
    deepStep: -1, // default: -1
    whiteZ: 0, // default: 0
    blackZ: -1,
    safeZ: 1,
    info: "console", // ["none" | "console" | "emitter"] default: "none"
    dirImg: dirPath,
  };

  await img2gcode
    .start(options)
    .on("log", str => console.log(str))
    .on("tick", (perc) => {
      bar.update(perc);
    });

    var baud = 115200;
    var serial = new SerialPort({path: port, baudRate: baud});
    lineByLine = new LineByLineReader('src/controllers/gcodes/no-lagg.gcode');

    await serial.on("open", function() {
      lineByLine.on('line', function(line) {
          console.log(line.split(":")[0])
          serial.write(line + "\n");
      });
    });
  res.status(201).send('Requisição recebida com sucesso!');
}