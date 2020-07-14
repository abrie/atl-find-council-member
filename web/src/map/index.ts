import { getDistrictsGeoFeatureCollection } from "../mapatlapi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function onEachFeature(feature, layer) {
  layer.on({
    click: (evt) => console.log(feature.properties.NAME),
  });
}

function mapCityCouncilDistrictFeatures(map, features) {
  features.forEach((feature) =>
    L.geoJSON(feature, { onEachFeature: onEachFeature }).addTo(map)
  );
}

export function attachMap(elementId: string) {
  const map = L.map(elementId).setView([33.749, -84.388], 10);

  var osm_mapnik = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
  ).addTo(map);

  getDistrictsGeoFeatureCollection().then((features) =>
    mapCityCouncilDistrictFeatures(map, features)
  );
}
