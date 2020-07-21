import { getDistrictsGeoFeatureCollection } from "../mapatlapi";
import { Stadia_AlidadeSmooth } from "./provider";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export async function attachMap(
  elementId: string,
  onDistrictSelected: (district: string) => void
) {
  const districtLayers = {};
  var selectedDistrict = undefined;

  const map = L.map(elementId).setView([33.749, -84.388], 10);

  function highlightDistrict(name) {
    districtLayers[name].setStyle({ fillOpacity: 0.5 });
  }

  function unHighlightDistrict(name) {
    if (selectedDistrict !== name) {
      districtLayers[name].setStyle({ fillColor: "#3388ff", fillOpacity: 0 });
    }
  }

  function pickDistrictFeature(name, callback) {
    if (selectedDistrict) {
      districtLayers[selectedDistrict].setStyle({
        fillColor: "#3388ff",
        fillOpacity: 0,
      });
    }

    selectedDistrict = name;
    districtLayers[selectedDistrict].setStyle({
      fillOpacity: 0.5,
      fillColor: "rgb(198, 246, 213)",
    });

    if (callback) {
      callback(name);
    }
  }

  const tileLayer = L.tileLayer(Stadia_AlidadeSmooth.url, {
    maxZoom: 19,
    attribution: Stadia_AlidadeSmooth.attribution,
  }).addTo(map);

  function addDistrictFeature(map, feature) {
    L.geoJSON(feature, {
      style: (f) => ({ opacity: 1, weight: 1, fillOpacity: 0 }),
      onEachFeature: onEachFeature,
    }).addTo(map);
  }

  function onEachFeature(feature, layer) {
    districtLayers[feature.properties.NAME] = layer;
    layer.on({
      click: () =>
        pickDistrictFeature(feature.properties.NAME, onDistrictSelected),
      mouseover: () => highlightDistrict(feature.properties.NAME),
      mouseout: () => unHighlightDistrict(feature.properties.NAME),
    });
  }

  const features = await getDistrictsGeoFeatureCollection();
  features.forEach((feature) => addDistrictFeature(map, feature));

  return { pickDistrictFeature };
}
