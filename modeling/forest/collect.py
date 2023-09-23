import requests
import os
import gc
import datetime
import sys
from dateutil import parser
from TifHandler import TifHandler
import pandas as pd
from time import sleep
from datetime import datetime

df = pd.read_csv("../data/Flood_Incidents.csv")
total = 0
skip = 0
found = False
for filename in os.listdir("/Volumes/Seagate/Mac/Documents/Science Fair/2020/TIF FIles"):
    if "._H" in filename:
        continue
    if filename == "Hansen_GFC-2019-v1.7_lossyear_80N_080E.tif":
        found = True
    if not found or filename == "Hansen_GFC-2019-v1.7_lossyear_80N_080E.tif":
        continue
    print("", filename)

    tif_name = filename
    th = TifHandler(
        "/Volumes/Seagate/Mac/Documents/Science Fair/2020/TIF FIles/" + tif_name)
    # th.thumbnail()
    print("")
    have = set()
    cnt = 0
    for idx, row in df.iterrows():
        if idx >= 5000:
            continue
        # row = row[1]
        # print(row)
        tag = str(row.EVENT_ID) + "..."
        lat = float(row.BEGIN_LAT)
        lon = float(row.BEGIN_LON)
        if tag in have or not th.inBounds(lat, lon):
            continue
        have.add(tag)
        cnt += 1
        # print(idx, ": ", row.EVENT_ID, " | ", lat, lon, "in", row.date)

        date = str(row.END_YEARMONTH)
        year = int(date[:-2])
        # lat, lon = lat, lon
        results = th.forestLoss(year, lat, lon)
        # print(results[0], results[1])

        writer = open("forest.txt", "a")
        writer.write(str(row.EVENT_ID) + ";;" +
                     str(results[0]) + ";;" + str(results[1]) + "||||\n")
        writer.close()

    del th
    gc.collect()
    total += cnt
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    print(cnt, total, current_time,
          "-------------------------------------------------")
