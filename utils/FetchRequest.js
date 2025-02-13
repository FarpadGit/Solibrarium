import axios from "axios";

let abortController = null;

const callGoogleBooks = axios.create({
  params: {
    key: process.env.BOOKS_API_KEY
  },
  method: "GET",
});

// wrapper function for basic outbound GET requests, mainly for requesting the Google Books API
export async function sendWithAPIKey(url) {
  try {
    abortController = new AbortController();
    const response = callGoogleBooks.request({
      url,
      signal: abortController.signal
    });
    const result = await response.then(res => res.data);
    return result;
  } catch (error) {
    return { error: true };
  }
}

// wrapper function for basic api requests (more generic then sendWithAPIKey)
// ** usecase **
// const answer = send("/api/users", { data: { name:"john" }, method: "PUT" });
export async function send(url, params) {
  let { data = null, method = "GET" } = params ?? {};
  if(data !== null && method.toUpperCase() === "GET") method = "POST";
  try {
    abortController = new AbortController();
    const response = axios.request({
      url,
      method,
      headers: data ? { "Content-Type": "application/json" } : undefined,
      data: data ? JSON.stringify(data) : undefined,
      signal: abortController.signal
    });
    const result = await response.then(res => res.data);
    return result;
  } catch (error) {
    return { error: true };
  }
}

export function abortSend() {
  // axios throws an Uncaught (in promise) Error when aborting without a try-catch
  try {
    abortController?.abort();
  } catch (error) {}
}