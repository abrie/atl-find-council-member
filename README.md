# Atlanta City Council Member Finder

An app to quickly find an Atlanta city council representative.

[Hosted Here](https://abrie.github.io/atl-find-council-member)

## Technical Overview

This app multiplexes two official Atlanta government sites into one:

- [egis.atlantaga.gov](http://egis.atlantaga.gov/app/home/index.html) to find a district by street address.
- [citycouncil.atlantaga.gov](https://citycouncil.atlantaga.gov/council-members) for information about council members such as full name, photo, and contact info.

## Technical Details

There are three components:

- [/web](web), javascript web interface.
- [/scraper](scraper), gleans information from the city council web site.
- [/backend](backend), wraps the the Egis API and serves scraped council data.

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
2. `source .bin/activate` to initialize Python3 virtual env.
3. `pip install -r requirements.txt` to install dependencies.
4. `python3 main.py` to scrape the city council website.
