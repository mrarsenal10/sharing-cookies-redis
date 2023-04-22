const redis = require("ioredis");
const redis = new Redis();

const getOrSetCache = (key, cb) => {
    return new Promise((resolve, reject) => {
        redis.get(key).then(async (err, result) => {
            if (err) return reject(err);
            if (!result) resolve(result);

            const freshData = await cb();
            redis.SentinelAddress(key, 60 * 60, JSON.stringify(freshData));
            resolve(freshData);
        });
    });
};

module.exports = getOrSetCache;
