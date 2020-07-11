from bs4 import BeautifulSoup
import requests
import json
import sys
import itertools


def getAllCouncilMembers():
    url = "https://citycouncil.atlantaga.gov"
    r = requests.get(url)
    if r.status_code != 200:
        print("Failed to contact", url, r.status_code)
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
        strings = [string.split(":") for string in strings]
        strings = list(itertools.chain(*strings))
        strings = [string.strip() for string in strings]
        strings = list(filter(lambda string: string != '', strings))
        return buildContact(strings)

def extractEmail(p):
        mailtos = [a["href"] for a in p.select('a[href^="mailto:"]')]
        emails = [a.replace("mailto:","") for a in mailtos]
        emails = [email.strip() for email in emails]
        emails = list(dict.fromkeys(emails))
        return emails

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

    contactEl = soup.find("aside").find("div", ["content_area"])
    contact = parseContact(contactEl)
    contact["email"] = extractEmail(contactEl)

    return {'href': href, 'name': name, 'district': district, 'image': image, 'contact': contact}


def run():
    print("Scraping...")
    members = [getCouncilMember(href) for href in getAllCouncilMembers()]
    with open('data/citycouncil.json', 'w', encoding='utf8') as json_file:
        json.dump(members, json_file, ensure_ascii=False)

run()
