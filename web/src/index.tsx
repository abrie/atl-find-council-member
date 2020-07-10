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

function clearAddressInput() {
  const input = document.getElementById("address-input") as HTMLInputElement;
  input.value = "";
}

function clearCandidateList() {
  const list = document.getElementById("candidates");
  clearElement(list);
}

function showRepresentativeCard(card) {
  const profile = document.getElementById("selected-candidate");
  clearElement(profile);
  profile.appendChild(card);
}

async function selectCandidate(candidate) {
  const [record] = await getRecord(candidate);

  clearAddressInput();
  clearCandidateList();

  const representative = await getRepresentative(record.COUNCIL_DIST);
  showRepresentativeCard(buildRepresentativeCard(representative));
}

function highlight(sub, full) {
  return (
    <span className="cursor-pointer truncate">
      <span className="text-gray-600 hover:text-black">{full}</span>
    </span>
  );
}

function buildCandidateList(address, candidates) {
  return (
    <div>
      {candidates.map((candidate) => (
        <div onclick={() => selectCandidate(candidate)}>
          {highlight(address, candidate.address)}
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
    const { value } = evt.currentTarget as HTMLInputElement;
    const candidates = await debouncedSearchAddress(value);
    showCandidateList(buildCandidateList(value, candidates));
  });
}

run();
