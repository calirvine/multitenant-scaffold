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
        if (!error) resolve(result);
      });
    });
  },
  del: key => {
    client.del(key);
  },
  update: (key, newKey) => {
    client.rename(key, newKey);
  },
  hset: (hash, key, value) => {
    client.hset(hash, key, value);
  },
  hget: (hash, key) => {
    return new Promise(resolve => {
      client.hget(hash, key, (error, reply) => {
        if (!error) resolve(reply);
      });
    });
  },
  hdel: (hash, key) => {
    client.hdel(hash, key);
  },
  hupdate: (hash, oldKey, newKey) => {
    client.hget(hash, oldKey, (error, reply) => {
      if (error) throw error;
      this.hset(hash, newKey, reply);
      this.hdel(hash, oldKey);
    });
  }
};
