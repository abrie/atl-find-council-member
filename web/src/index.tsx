import debounce from "awesome-debounce-promise";
import h from "hyperscript";
import { checkResponse, clearElement } from "./utils";
import buildCityDistrictCard from "./citydistrictcard";
import buildNPUCard from "./npucard";
import { getRepresentative } from "./mapatlapi";
import { searchAddress, MatchedAddress } from "./geocoder";
import newSearchBox from "./searchbox";
import { attachMap } from "./map";

const debouncedSearchAddress = debounce(searchAddress, 250);

async function getNPU(npu: string) {
  return Promise.resolve(npu);
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

function clearSelectedNPU() {
  const el = document.getElementById("selected-npu");
  clearElement(el);
}

async function selectMapDistrict(district) {
  const representative = await getRepresentative(district);
  showCityDistrictCard(buildCityDistrictCard(representative));
}

async function run() {
  const map = await attachMap("map", (district) => {
    searchBox.clear();
    selectMapDistrict(district);
  });

  const searchBox = newSearchBox(
    debounce(searchAddress, 250),
    (candidate: MatchedAddress) => {
      selectCandidate(candidate, map.pickDistrictFeatureByCoordinates);
      searchBox.clear();
    }
  );

  document.getElementById("app").prepend(searchBox.el);
  document.getElementById("app").classList.remove("hidden");
}

run();
