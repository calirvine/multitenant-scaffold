const EventEmitter2 = require('eventemitter2').EventEmitter2;
const userEvents = require('./users');
const appEvents = require('./app');
const tenantEvents = require('./tenants');

const Emitter = new EventEmitter2();

userEvents(Emitter);
appEvents(Emitter);
tenantEvents(Emitter);

module.exports = Emitter;
