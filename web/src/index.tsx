import debounce from "awesome-debounce-promise";
import h from "hyperscript";
import { checkResponse, clearElement } from "./utils";
import buildCityDistrictCard from "./citydistrictcard";
import buildNPUCard from "./npucard";
import buildCandidateList from "./candidatelist";
import { getRepresentative } from "./mapatlapi";
import { searchAddress } from "./geocoder";
import { attachMap } from "./map";

var selectDistrict = undefined;

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

async function selectCandidate(candidate, pickDistrictFeatureByCoordinates) {
  clearAddressInput();
  clearCandidateList();

  const districts = pickDistrictFeatureByCoordinates(candidate.coordinates);

  const districtCards = await Promise.all(
    districts.map(async (district) =>
      buildCityDistrictCard(await getRepresentative(district))
    )
  );

  districtCards.forEach((card) => showCityDistrictCard(card));

  //const npu = await getNPU(record.NPU_NAME);
  //showNPUCard(buildNPUCard(npu));
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

async function selectMapDistrict(district) {
  clearAddressInput();
  clearCandidateList();

  const representative = await getRepresentative(district);
  showCityDistrictCard(buildCityDistrictCard(representative));
}

async function run() {
  document.getElementById("app").classList.remove("hidden");
  const {
    pickDistrictFeatureByName,
    pickDistrictFeatureByCoordinates,
  } = await attachMap("map", selectMapDistrict);

  const debouncedSearchAddress = debounce(searchAddress, 250);

  const addressInputElement = document.getElementById(
    "address-input"
  ) as HTMLInputElement;

  addressInputElement.addEventListener("input", async (evt) => {
    clearSelectedCandidate();
    clearSelectedNPU();

    const { value } = evt.currentTarget as HTMLInputElement;
    const result = await debouncedSearchAddress({
      street: value,
      city: "atlanta",
      state: "ga",
    });

    showCandidateList(
      buildCandidateList(value, result.addressMatches, (candidate) =>
        selectCandidate(candidate, pickDistrictFeatureByCoordinates)
      )
    );
  });
}

run();
