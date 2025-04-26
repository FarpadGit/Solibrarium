import { Redis } from '@upstash/redis';

const options = {
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
    cache: "default"
  }
  
const redis = new Redis(options);

export default redis;
