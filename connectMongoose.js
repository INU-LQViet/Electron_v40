const mongoose = require('mongoose');

urlLink = 'mongodb+srv://lqviet:vancuong@emg0.eretb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(urlLink, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

var connect = mongoose.connection;

connect.on('connected', function(){
    console.log('Successfully connected!');
});

connect.on('disconnected', function(){
    console.log('Successfully disconnected!');
});

connect.on('error', console.error.bind(console, 'connection error: '));

module.exports = connect;