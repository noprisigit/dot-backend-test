const redis = require("redis");
const client = redis.createClient();

const removeRedisKey = (keys) => {
  client.del(keys);
  client.quit();
}

module.exports = removeRedisKey;