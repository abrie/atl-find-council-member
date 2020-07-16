import { getDistrictsGeoFeatureCollection } from "../mapatlapi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export function attachMap(
  elementId: string,
  onDistrictSelected: (district: string) => void
) {
  var selectedDistrict = undefined;
  var selectedLayer = undefined;
  const map = L.map(elementId).setView([33.749, -84.388], 10);

  var osm_mapnik = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
  ).addTo(map);

  function mapCityCouncilDistrictFeatures(map, features) {
    features.forEach((feature) =>
      L.geoJSON(feature, {
        style: (f) => ({ opacity: 1, weight: 2, fillOpacity: 0 }),
        onEachFeature: onEachFeature,
      }).addTo(map)
    );
  }

  function onEachFeature(feature, layer) {
    layer.on({
      click: (evt) => onDistrictSelected(feature.properties.NAME),
      mouseover: (evt) => evt.target.setStyle({ fillOpacity: 0.5 }),
      mouseout: (evt) => evt.target.setStyle({ fillOpacity: 0 }),
    });
  }

  getDistrictsGeoFeatureCollection().then((features) =>
    mapCityCouncilDistrictFeatures(map, features)
  );
}
