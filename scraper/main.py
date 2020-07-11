from bs4 import BeautifulSoup
import requests
import json
import sys


def getAllCouncilMembers():
    r = requests.get("https://citycouncil.atlantaga.gov")
    if r.status_code != 200:
        sys.exit(-1)

    soup = BeautifulSoup(r.text, 'html.parser')
    tab = soup.find(id="ColumnUserControl2")
    nav = tab.find("nav")
    ul = nav.find("ul")
    lis = ul.find_all("li", recursive=False)
    hrefs = [li.find("a")["href"] for li in lis]
    return hrefs


def buildContact(strings):
    result = {"Office Location":[],"P":[],"F":[],"E":[],"Committee Assignments":[]}
    current = False
    for string in strings:
        if string in result:
            current = result[string]
        elif current != False:
            current.append(string)

    fromto_mapping = {"Office Location":"office","P":"phone","F":"fax","E":"email","Committee Assignments":"committees"}
    return {fromto_mapping.get(k, k): v for k, v in result.items() if k in fromto_mapping}

def parseContact(p):
        strings = [string for string in p.strings]
        strings = [string.replace(':','') for string in strings]
        strings = [string.strip() for string in strings]
        strings = list(filter(lambda string: string != '', strings))
        return buildContact(strings)

def getCouncilMember(href):
    print(href)
    r = requests.get(href)
    if r.status_code != 200:
        return {'href': href, 'error': r.status_code}

    soup = BeautifulSoup(r.text, 'html.parser')
    name = soup.find("h1", ["titlewidget-title"]).find("span").contents[0]
    district = soup.find("h2", ["titlewidget-subtitle"]).contents[0]
    image = soup.find("aside").find(
        "div", ["image_widget"]).find("img")["src"]

    contact = soup.find("aside").find("div", ["content_area"])
    contact = parseContact(contact)

    return {'href': href, 'name': name, 'district': district, 'image': image, 'contact': contact}


def run():
    members = [getCouncilMember(href) for href in getAllCouncilMembers()]
    with open('data/citycouncil.json', 'w', encoding='utf8') as json_file:
        json.dump(members, json_file, ensure_ascii=False)


run()
