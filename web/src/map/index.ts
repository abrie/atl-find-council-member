import { getDistrictsGeoFeatureCollection } from "../mapatlapi";
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

  function pickDistrict(name, callback) {
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

  const osm_mapnik = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
  ).addTo(map);

  function addDistrictFeature(map, feature) {
    L.geoJSON(feature, {
      style: (f) => ({ opacity: 1, weight: 2, fillOpacity: 0 }),
      onEachFeature: onEachFeature,
    }).addTo(map);
  }

  function onEachFeature(feature, layer) {
    districtLayers[feature.properties.NAME] = layer;
    layer.on({
      click: () => pickDistrict(feature.properties.NAME, onDistrictSelected),
      mouseover: () => highlightDistrict(feature.properties.NAME),
      mouseout: () => unHighlightDistrict(feature.properties.NAME),
    });
  }

  const features = await getDistrictsGeoFeatureCollection();
  features.forEach((feature) => addDistrictFeature(map, feature));

  return { pickDistrict };
}
