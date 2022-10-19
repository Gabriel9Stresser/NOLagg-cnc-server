var img2gcode = require("img2gcode");
var base64Img = require('base64-img');
var SerialPort = require('serialport');
var LineByLineReader = require('line-by-line');

var serial_port = 'COM3';

function sleep(time, callback) {
  var stop = new Date().getTime();
  while(new Date().getTime() < stop + time) {
      ;
  }
  callback();
}

function startSerialTransmission(data) {
  var baud = 115200;
  var serial = new SerialPort.SerialPort({path: serial_port, baudRate: baud});
  console.log('-------- Serial Port Begin ----------');
  lineByLine = new LineByLineReader('src/controllers/gcodes/no-lagg.gcode');

  serial.on("open", function() {
    console.log('-------- open Port ----------');
    lineByLine.on('line', function(line) {
        console.log(line.split(":")[0])
        serial.write(line + "\n");
    });
  });
}

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
  info: "emitter", // ["none" | "console" | "emitter"] default: "none"
  dirImg:  __dirname + '/gcodes/no-lagg.jpeg'
};

exports.port = async (req, res, next) => {
  let port = req.body.port;
  var img = req.body.image;

  serial_port = port

  const base64 = fs.readFileSync(img, "base64");
  const buffer = Buffer.from(base64, "base64");
  fs.writeFileSync(__dirname + "/gcodes/no-lagg.jpeg", buffer);

  res.status(201).send('Requisição recebida com sucesso!');
}

exports.gcode = async (req, res, next) => {
  img2gcode
    .start(options)
    .on("log", str => console.log(str))
    .then(data => {
      startSerialTransmission(data)
    });
  res.status(201).send('Requisição recebida com sucesso!');
}