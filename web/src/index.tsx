import debounce from "awesome-debounce-promise";
import h from "hyperscript";
import { checkResponse, clearElement } from "./utils";
import buildCityDistrictCard from "./citydistrictcard";
import buildNPUCard from "./npucard";
import buildCandidateList from "./candidatelist";
import {
  fetchAddressCandidates,
  fetchCandidate,
  fetchRepresentative,
} from "./mapatlapi";

async function searchAddress(address) {
  return fetchAddressCandidates(address)
    .then((resp) => checkResponse(resp))
    .then((resp) => resp.json())
    .then(({ candidates }) => candidates);
}

async function getRecord(candidate) {
  return fetchCandidate(candidate)
    .then((resp) => checkResponse(resp))
    .then((resp) => resp.json());
}

async function getRepresentative(district: number) {
  return fetchRepresentative(district)
    .then((resp) => checkResponse(resp))
    .then((resp) => resp.json());
}

async function getNPU(npu: string) {
  return Promise.resolve(npu);
}

function clearAddressInput() {
  const input = document.getElementById("address-input") as HTMLInputElement;
  input.value = "";
}

function clearCandidateList() {
  const el = document.getElementById("candidates");
  clearElement(el);
}

function showCityDistrictCard(card) {
  const el = document.getElementById("selected-candidate");
  clearElement(el);
  el.appendChild(card);
}

function showNPUCard(card) {
  const el = document.getElementById("selected-npu");
  clearElement(el);
  el.appendChild(card);
}

async function selectCandidate(candidate) {
  const [record] = await getRecord(candidate);

  clearAddressInput();
  clearCandidateList();

  const representative = await getRepresentative(record.COUNCIL_DIST);
  showCityDistrictCard(buildCityDistrictCard(representative));

  const npu = await getNPU(record.NPU_NAME);
  showNPUCard(buildNPUCard(npu));
}

function clearSelectedCandidate() {
  const el = document.getElementById("selected-candidate");
  clearElement(el);
}

function clearSelectedNPU() {
  const el = document.getElementById("selected-npu");
  clearElement(el);
}

function showCandidateList(el) {
  const list = document.getElementById("candidates");
  clearElement(list);
  list.appendChild(el);
}

function run() {
  const debouncedSearchAddress = debounce(searchAddress, 250);

  const addressInputElement = document.getElementById(
    "address-input"
  ) as HTMLInputElement;

  addressInputElement.addEventListener("input", async (evt) => {
    clearSelectedCandidate();
    clearSelectedNPU();

    const { value } = evt.currentTarget as HTMLInputElement;
    const candidates = await debouncedSearchAddress(value);

    showCandidateList(
      buildCandidateList(value, candidates, (candidate) =>
        selectCandidate(candidate)
      )
    );
  });
}

run();
