//wrapper function for basic fetch requests
// ** usecase **
// const answer = send({url: "/api/users", params: {name:"john"}, callback: (res) => console.log(res)})
export async function send({
  url,
  params = null,
  method = "POST",
  callback = (body) => body,
}) {
  const fetchResponse = await fetch(
    url,
    params && {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }
  );
  try {
    const result = await fetchResponse.json().then(callback);
    return result;
  } catch (error) {
    return new Error(error);
  }
}
