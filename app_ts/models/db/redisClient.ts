import redis from 'redis';
import {promisify} from 'util';

const redisClient = redis.createClient(global.gConfig.redis);
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

export {redisClient, getAsync, setAsync};