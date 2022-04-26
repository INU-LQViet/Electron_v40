const mongoose = require('mongoose');

const signalArduino = mongoose.Schema({
  meta:[[]],
});

const Model = mongoose.model('modelData',signalArduino, "Database");
module.exports = Model;