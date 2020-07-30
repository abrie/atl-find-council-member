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
  return obj;
}

export interface Address {
  street: string;
  city: string;
  state: string;
}

export type MatchedAddress = string;

export interface Coordinates {
  x: number;
  y: number;
}

export interface AddressMatch {
  matchedAddress: MatchedAddress;
  coordinatess: Coordinates;
}

export type SearchFunc = (Address) => Promise<SearchResult>;

export interface SearchResult {
  addressMatches: AddressMatch[];
  error: string | null;
}

export async function searchAddress(address: Address): Promise<SearchResult> {
  return fetchAddressCandidates(address)
    .then((resp) => checkResponse(resp))
    .then((resp) => resp.json())
    .then((json) => logAndReturn(json));
}
