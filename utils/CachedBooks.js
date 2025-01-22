import redis from "@/utils/RedisConnect";

// The Google Books API has a daily limit of 1000 requests so it would be prudent to cache any books that were already queried
export async function cacheBook(book) {
    await redis.set(book.id, JSON.stringify(book), { ex: 86400 }); 
}

export async function getFromCache(id) {    
    return await redis.get(id);
}