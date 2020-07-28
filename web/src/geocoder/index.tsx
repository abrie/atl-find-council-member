import { checkResponse } from "../utils";

function endpointFor(path: string): string {
  const { SNOWPACK_PUBLIC_API_HOST: host } = import.meta.env;
  return `${host}/${path}`;
}

async function fetchAddressCandidates(address) {
  const body = { address };
  const request = new Request(endpointFor("geocoder"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return fetch(request);
}

function logAndReturn(obj) {
  //console.log(obj);
  return obj;
}

export async function searchAddress(address) {
  return fetchAddressCandidates(address)
    .then((resp) => checkResponse(resp))
    .then((resp) => resp.json())
    .then((json) => logAndReturn(json));
}
