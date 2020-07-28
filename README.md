# Atlanta City Council Member Finder

An app to quickly find an Atlanta city council representative.

[Hosted Here](https://abrie.github.io/atl-find-council-member)

## Technical Overview

This app works by multiplexing a few commercial, federal and local Atlanta government sites into one.

- [egis.atlantaga.gov](http://egis.atlantaga.gov/app/home/index.html) to find a district by street address.
- [citycouncil.atlantaga.gov](https://citycouncil.atlantaga.gov/council-members) for information about council members such as full name, photo, and contact info. -[dcp-coaplangis.opendata.arcgis.com](dcp-coaplangis.opendata.arcgis.com/datasets/city-council-districts/datasets/city-council-districts) for city council district boundries.
- [geocoding.geo.census.gov](https://geocoding.geo.census.gov/) to get long/lat coordinates for a street address.

## Technical Details

There are three components:

- [/web](web), javascript web interface.
- [/scraper](scraper), gleans information from the city council web site.
- [/backend](backend), provides the Geocoding API and serves scraped council data.

## For Developers

1. Fork this repo: [click here](https://github.com/abrie/atl-find-council-member/fork)
2. Clone the fork onto your development machine.

### Frontend development:

The frontend uses Typescript, Tailwind CSS, JSX, and Snowpack.

1. Change to front end's folder: `cd web`
2. Install dependencies: `yarn install`
3. Start the devserver: `yarn start`

### Backend development:

The backend uses Go and the Chi router framework, packaged into a docker container.

1. `cd backend`
2. `make all`
3. `./bin/cli` to run queries programatically, or
4. `./bin/server -d data` to run queries through the api.

### Scraper development:

1. `cd scraper`
2. `python3 -m venv ./venv` to create a Python3 virtual env.
3. `source ./venv/bin/activate` to load the virtual env.
4. `pip install -r requirements.txt` to install dependencies.
5. `python3 main.py` to scrape the city council website and save as `citycouncil.json`.
