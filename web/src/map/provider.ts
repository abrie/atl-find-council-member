const Esri_WorldGrayCanvas = {
  url:
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
  maxZoom: 16,
};

const OpenStreetMap = {
  url: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
  attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
  maxZoom: 16,
};

export default OpenStreetMap;
