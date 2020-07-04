const path = require("path");

module.exports = {
  scripts: {
    "mount:public": "mount public --to /",
    "mount:src": "mount src --to /_dist_",
    "mount:static": "mount static --to /",
    "run:tsc": "tsc --jsx preserve --noEmit",
    "run:tsc::watch": "$1 --watch",
    "build:css": "postcss",
    "build:tsx": "esbuild --jsx-factory=h --jsx-fragment=Fragment --loader=tsx",
  },
  plugins: [
    ["@snowpack/plugin-dotenv"],
    [
      "@snowpack/plugin-webpack",
      {
        extendConfig: (config) => {
          const leafletImages = {
            "./images/layers.png$": path.resolve(
              __dirname,
              "./node_modules/leaflet/dist/images/layers.png"
            ),
            "./images/layers-2x.png$": path.resolve(
              __dirname,
              "./node_modules/leaflet/dist/images/layers-2x.png"
            ),
            "./images/marker-icon.png$": path.resolve(
              __dirname,
              "./node_modules/leaflet/dist/images/marker-icon.png"
            ),
            "./images/marker-icon-2x.png$": path.resolve(
              __dirname,
              "./node_modules/leaflet/dist/images/marker-icon-2x.png"
            ),
            "./images/marker-shadow.png$": path.resolve(
              __dirname,
              "./node_modules/leaflet/dist/images/marker-shadow.png"
            ),
          };
          Object.assign(config.resolve.alias, leafletImages);
          config.module.rules.push({
            test: /\.(png|svg|jpg|gif)$/,
            use: {
              loader: "file-loader",
            },
          });
          return config;
        },
      },
    ],
  ],
};
