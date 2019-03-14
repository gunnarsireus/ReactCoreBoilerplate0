import * as queryString from "query-string";
import Result from "@Models/Result";

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
): Promise<Result<S>> {
  url = `${url}${getQueryString(query)}`;
  const response = await fetch(url, {
    headers: defaultHeaders,
    method: "GET"
  });

  if (!response.ok) throw response;

  return response.json();
}

export async function postHelper<Q = any, S = any>(
    url: string,
    request: Q,
    query?: object
): Promise<Result<S>> {
    url = `${url}${getQueryString(query)}`;

    const response = await fetch(url, {
        headers: defaultHeaders,
        method: "POST",
        body: request ? JSON.stringify(request) : null
    });

    if (!response.ok) throw response;

    return response.json();
}

export async function putHelper<Q = any, S = any>(
    url: string,
    request: Q,
    query?: object
): Promise<Result<S>> {
    url = `${url}${getQueryString(query)}`;

    const response = await fetch(url, {
        headers: defaultHeaders,
        method: "PUT",
        body: request ? JSON.stringify(request) : null
    });

    if (!response.ok) throw response;

    return response.json();
}

export async function patchHelper<Q = any, S = any>(
    url: string,
    request: Partial<Q>,
    query?: object
): Promise<Result<S>> {
    url = `${url}${getQueryString(query)}`;

    const response = await fetch(url, {
        headers: defaultHeaders,
        method: "PATCH",
        body: request ? JSON.stringify(request) : null
    });

    if (!response.ok) throw response;

    return response.json();
}

export async function deleteHelper<S = any>(
    url: string,
    query?: object
): Promise<Result<S>> {
    url = `${url}${getQueryString(query)}`;

    const response = await fetch(url, {
        headers: defaultHeaders,
        method: "DELETE"
    });

    if (!response.ok) throw response;

    return response.json();
}