const EventEmitter2 = require('eventemitter2').EventEmitter2;
const events = require('./events');
const userEvents = require('./users');

const Emitter = new EventEmitter2();

userEvents(Emitter);

module.exports = Emitter;
