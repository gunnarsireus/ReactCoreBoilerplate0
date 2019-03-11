import * as queryString from "query-string";

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
   Accept: "application/json",
  "Accept-Language": "*"
};


function getQueryString(query?: object): string {
  if (!query) return "";

  const stringifiedQuery = queryString.stringify(query);

  return `?${stringifiedQuery}`;
}

export async function getHelper<S = any>(
  url: string,
  query?: object
): Promise<S> {
  url = `${url}${getQueryString(query)}`;
  const response = await fetch(url, {
    headers: defaultHeaders,
    method: "GET"
  });

  if (!response.ok) throw response;

  return response.json();
}