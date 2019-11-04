// redis-client.js
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

client.on('connect', function() {
  console.log('Redis client connected');
});

client.on('error', function(err) {
  console.log('Something went wrong ' + err);
});

module.exports = {
  set: (key, value, print = false) => {
    client.set(key, value, print ? redis.print : () => {});
  },
  get: key => {
    return new Promise(resolve => {
      client.get(key, (error, result) => {
        resolve(result);
      });
    });
  },
  del: key => {
    client.del(key);
  },
  update: (key, newKey) => {
    client.rename(key, newKey);
  }
};
