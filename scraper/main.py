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


def toText(tag):
    string = str(tag)
    return string.replace("\n", '').replace("\r", '')


def buildContact(strings):
    result = {"Office Location":[],"P":[],"F":[],"E":[],"Committee Assignments":[]}
    current = False
    for string in strings:
        if string in result:
            current = result[string]
            print(string, current)
        elif current != False:
            current.append(string)

    return result

def parseContact(html):
    soup = BeautifulSoup(html, 'html.parser')
    p = soup.find("p")
    if p :
        strings = [string for string in soup.strings]
        strings = [string.replace(':','') for string in strings]
        strings = [string.strip() for string in strings]
        strings = list(filter(lambda string: string != '', strings))
        return buildContact(strings)
    else:
        return {}

def getCouncilMember(href):
    r = requests.get(href)
    if r.status_code != 200:
        return {'href': href, 'error': r.status_code}

    soup = BeautifulSoup(r.text, 'html.parser')
    name = soup.find("h1", ["titlewidget-title"]).find("span").contents[0]
    district = soup.find("h2", ["titlewidget-subtitle"]).contents[0]
    image = soup.find("aside").find(
        "div", ["image_widget"]).find("img")["src"]

    contact = soup.find("aside").find("div", ["content_area"]).contents[0]
    contact = parseContact(toText(contact))

    return {'href': href, 'name': name, 'district': district, 'image': image, 'contact': contact}


def run():
    members = [getCouncilMember(href) for href in getAllCouncilMembers()]
    with open('citycouncil.json', 'w', encoding='utf8') as json_file:
        json.dump(members, json_file, ensure_ascii=False)


run()
