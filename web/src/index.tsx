import debounce from "awesome-debounce-promise";
import h from "hyperscript";
import { checkResponse, clearElement } from "./utils";
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

function buildRepresentativeCard(representative) {
  return (
    <div className="py-3 flex justify-between">
      <div className="w-1/3 flex items-center justify-left">
        <div className="text-xl">{representative.District}</div>
      </div>
      <div className="w-1/3 flex items-center justify-center">
        <a className="text-xl" href={representative.Href}>
          {representative.Name}
        </a>
      </div>
      <div className="w-1/3 flex items-center justify-end">
        <img
          className="w-24"
          src={`https://citycouncil.atlantaga.gov${representative.Image}`}
        />
      </div>
    </div>
  );
}

function buildNPUCard(npu) {
  return (
    <div className="py-3 flex justify-between">
      <div classname="w-full flex items-center justify-left">
        Neighborhood Planning Unit: {npu}
      </div>
    </div>
  );
}

function clearAddressInput() {
  const input = document.getElementById("address-input") as HTMLInputElement;
  input.value = "";
}

function clearCandidateList() {
  const el = document.getElementById("candidates");
  clearElement(el);
}

function showRepresentativeCard(card) {
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
  showRepresentativeCard(buildRepresentativeCard(representative));

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

function buildCandidateList(address, candidates) {
  return (
    <div>
      {candidates.map((candidate) => (
        <div
          className="cursor-pointer truncate text-gray-600 hover:text-black"
          onclick={() => selectCandidate(candidate)}
        >
          {candidate.address}
        </div>
      ))}
    </div>
  );
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
    showCandidateList(buildCandidateList(value, candidates));
  });
}

run();
