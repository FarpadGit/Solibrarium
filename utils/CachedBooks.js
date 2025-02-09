import redis from "@/utils/RedisConnect";

const expirationInMS = 86400; //1 day

// The Google Books API has a daily limit of 1000 requests so it would be prudent to cache any books that were already queried
export async function cacheBook(book) {
    await redis.set(book.id, JSON.stringify(book), { ex: expirationInMS });
}

export async function getFromCache(id) {
    return await redis.get(id);
}