const redis = require("redis");
const client = redis.createClient();

const removeRedisKey = (keys) => {
  if (keys.length > 0) {
    client.del(keys, (err, reply) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

module.exports = { removeRedisKey };
