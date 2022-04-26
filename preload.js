
const {SerialPort} = require('serialport');
const {ReadlineParser} = require('@serialport/parser-readline');
const db = require('./connectMongoose');
var signalArduino = require('./model');

var fs = require('fs');
var temp = [];

process.env.SOCKET_PORT = 18092;
const io = require('socket.io')();

io.listen(process.env.SOCKET_PORT);
const dataPort = new SerialPort({path:'COM3', baudRate: 1000000}, function(err){
    if (err){
      console.log('Please connect the cab!');
    }
});
const parser = new ReadlineParser();
dataPort.pipe(parser);
parser.on('data', (signal)=>{    
  io.sockets.emit('signal',{signal:signal});
});


var signalData = new signalArduino;

window.addEventListener('DOMContentLoaded', () => {
  var starWrite = document.getElementById('startChart');
  var stopWrite = document.getElementById('exportData');
  stopWrite.disabled = true;
  starWrite.addEventListener('click',()=>{
    var writeStream = fs.createWriteStream('example.csv');
    stopWrite.disabled = false;
    starWrite.disabled = true;
    parser.on('data',(signal)=>{
      writeStream.write(signal, ()=>{});
      temp.push(parseFloat(signal));
    })
    stopWrite.addEventListener('click',()=>{
      stopWrite.disabled = true;
      starWrite.disabled = false;
      writeStream.end();
      signalData.meta.push(temp);
      signalData.save(function(err){
        if (err) return console.log(err);});
      temp.length = 0;
    });
  });
});
