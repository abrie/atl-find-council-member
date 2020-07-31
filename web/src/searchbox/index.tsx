import h from "hyperscript";
import buildCandidateList from "./candidatelist";
import type { SearchFunc, AddressMatch } from "../geocoder";

function buildElement(onInput: (string) => void) {
  return (
    <div className="relative px-2 mx-auto text-gray-600">
      <input
        className="w-full border-2 border-gray-400 bg-white h-10 px-5 pl-8 rounded-lg text-lg focus:outline-none"
        type="search"
        name="search"
        oninput={(evt) => onInput(evt.target.value)}
        placeholder="Search by street address, or click on the map."
      />

      <button className="absolute left-0 top-0 mt-2 ml-5" type="submit">
        &#128269;
      </button>

      <div className="results ml-10 mb-3 w-full"></div>
    </div>
  );
}

export default function (
  target: string,
  searchFunc: SearchFunc,
  pickFunc: (AddressMatch) => void
) {
  const runSearch = async (street) => {
    const result = await searchFunc({ street, city: "atlanta", state: "ga" });
    const resultsElement = el.querySelector(".results");
    resultsElement.innerHTML = "";
    resultsElement.appendChild(
      buildCandidateList(street, result.addressMatches, pickFunc)
    );
  };

  const el = buildElement((street) => runSearch(street));

  const clear = () => {
    el.querySelector("input").value = "";
    el.querySelector(".results").innerHTML = "";
  };

  document.getElementById(target).appendChild(el);

  return { clear };
}
