import os
from tqdm import tqdm
import requests
from bs4 import BeautifulSoup

# get list of download urls from the database
data_url = "https://www1.ncdc.noaa.gov/pub/data/swdi/stormevents/csvfiles/"
r = requests.get(data_url)
soup = BeautifulSoup(r.text, features="html.parser")
urls = [link.get('href') for link in soup.findAll('a')]

# filter url by making sure urls are not directories or query links
urls = [url for url in urls if "/" not in url.split(".")[-1] and "?" not in url]
for i in urls:
    print(i)

if not os.path.isdir("data"):
    os.mkdir("data")

if not os.path.isdir("data"):
    os.mkdir("data")

for url in tqdm(urls):
    os.system(f"cd data && wget {data_url}{url} > /dev/null 2>&1")

os.system("gunzip data/*.gz")