const config = require('./config');

const logger = (req, res, next) => {
  req.logger = (log, level = 'info') => {
    if (config.NODE_ENV === 'development') {
      console.log(log);
    } else {
      if (level === 'warn' || level === 'error') {
        console.log(log);
      }
    }
  };
  next();
};

module.exports = { logger };
