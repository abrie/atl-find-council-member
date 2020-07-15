import { checkResponse } from "../utils";

function endpointFor(path: string): string {
  const { SNOWPACK_PUBLIC_API_HOST: host } = import.meta.env;
  return `${host}/${path}`;
}

function fetchAddressCandidates(address) {
  const body = { address };
  const request = new Request(endpointFor("address"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return fetch(request);
}

export async function searchAddress(address) {
  return fetchAddressCandidates(address)
    .then((resp) => checkResponse(resp))
    .then((resp) => resp.json())
    .then(({ candidates }) => candidates);
}

export async function getRecord(candidate) {
  return fetchCandidate(candidate)
    .then((resp) => checkResponse(resp))
    .then((resp) => resp.json());
}

export async function getRepresentative(district: number) {
  return fetchRepresentative(district)
    .then((resp) => checkResponse(resp))
    .then((resp) => resp.json())
    .catch((err) => undefined);
}

export async function getDistrictsGeoFeatureCollection() {
  return fetchDistrictsGeoFeatureCollection()
    .then((resp) => checkResponse(resp))
    .then((resp) => resp.json())
    .then(({ data: { features } }) => features);
}

function fetchCandidate(candidate) {
  const {
    attributes: { Ref_ID },
  } = candidate;
  const body = { Ref_ID };
  const request = new Request(endpointFor("record"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return fetch(request);
}

function fetchRepresentative(district: number) {
  const body = { district: `District ${district}` };
  const request = new Request(endpointFor("council"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return fetch(request);
}

function fetchDistrictsGeoFeatureCollection() {
  const body = { dataset: "districts" };
  const request = new Request(endpointFor("geo"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return fetch(request);
}
