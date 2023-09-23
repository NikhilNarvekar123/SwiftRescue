import pandas as pd
from Collector import Collector
from DataExtractor import DataExtractor
from datetime import datetime

df = pd.read_csv("dataset.csv")
temp = open("precips.txt")
skip = len(temp.readlines())
print(skip)

for idx, row in enumerate(df.iterrows()):
    if idx < skip:
        continue
    # if idx == 0:
    # break
    row = row[1]
    lat = str(row.BEGIN_LAT)
    lon = str(row.BEGIN_LON)
    date = row.BEGIN_DATE
    parts = date.split("/")
    date = parts[0]+"/" + parts[2] + "/" + parts[1]
    c = Collector(lat, lon, date)
    file = open("precips.txt", "a")
    data = c.getData()
    if data[0] == 'no' or data[1] == 'no':
        print("API RAN OUT: . Didn't get", idx)
        break
    if idx % 50 == 0:
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print(idx, current_time, " || ", date, lat, lon, data)
    file.write(str(row.EVENT_ID) + ";;" + data[0] + ";;" + data[1] + "|||\n")
    # file.close()
