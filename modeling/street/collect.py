import pandas as pd
import os
import requests
from OSMHandler import OSMHandler
from datetime import datetime
from time import sleep

df = pd.read_csv("../data/Flood_Incidents.csv")
dif = 0.006
tags = []
tagF = open("tags.txt", "r")
tags = tagF.read().split(", ")
content = []
ids = []
df2 = pd.DataFrame(columns=["EVENT_ID", "osm"])
print(len(df))
for idx, row in enumerate(df.iterrows()):
    if idx <= 1000:
        continue
    if idx == 1401:
        df2.to_csv("missing.csv")
        break
    row = row[1]
    handler = OSMHandler(tags)
    lat = float(row.BEGIN_LAT)
    lon = float(row.BEGIN_LON)
    a1 = lat - dif
    a2 = lat + dif
    b1 = lon - dif
    b2 = lon + dif
    sleep(1.1)
    url = "https://api.openstreetmap.org/api/0.6/map?bbox={},{},{},{}".format(
        b1, a1, b2, a2)
    if idx >= 5000:
        df2.to_csv("missing.csv")
        break
    try:
        r = requests.get(url)
        f_name = "temp.osm"
        open(f_name, 'w').close()
        with open(f_name, 'wb') as f:
            f.write(r.content)
        handler.apply_file(f_name)
        count = handler.count()

        # print(lat, lon, a1, a2, b1, b2)
        df2.loc[idx] = [row.EVENT_ID, count]
        if idx % 100 == 0:
            now = datetime.now()
            current_time = now.strftime("%H:%M:%S")
            print("Saved pos", idx, " out of ", float(
                idx * 100/len(df)), current_time)
            df2.to_csv("missing.csv")
    except Exception as e:
        df2.loc[idx] = [row.EVENT_ID, -1]
        df2.to_csv("missing.csv")
