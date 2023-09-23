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
import math
df = pd.read_csv("../data/Flood_Incidents.csv")
cnt = 0
f  = dict()
for idx, row in enumerate(df.iterrows()):
    if idx > 5000:
        break
    row = row[1]
    lat = float(row.BEGIN_LAT)
    lon = float(row.BEGIN_LON)
    key = math.floor(lat/10)
    if key in f:
        f[key] += 1
    else:
        f[key] = 0
    # f[math.floor(lat)]+=1
    if lat >= 30 and lat < 50:
        cnt += 1
print(cnt)
print(f)
