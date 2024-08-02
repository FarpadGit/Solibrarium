// The Google Books API has a daily limit of 1000 requests so it would be prudent to cache any books that were already queried
let cache = [];

export function cacheBook(book) {
    if(!cache.find(b => b.id === book.id)) cache = [...cache, book];
}

export function getFromCache(id) {
    return cache.find(b => b.id === id);
}