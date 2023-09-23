import pandas as pd

df = pd.read_csv("../data/Flood_Incidents.csv")
d = dict()
for idx, row in enumerate(df.iterrows()):
    if idx > 5100:
        break
    # if idx == 0:
    # break
    row = row[1]
    if row.EVENT_ID not in d:
        d[row.EVENT_ID] = [row.BEGIN_LAT, row.BEGIN_LON, row.BEGIN_DATE]
    else:
        print("DUP ", idx, row, row.EVENT_ID)
    # lat = float(row.BEGIN_LAT)
    # lon = float(row.BEGIN_LON)
    # date = str(line.split(" ")[2])
    # print(lat, lon)

    # c = Collector(lat, lon, date)
    # weather = [date, lat, lon]
    # weather.extend(c.getData())
    # precip = []
    # for i in range(3, len(weather), 5):
    # precip.append(weather[i])

df2 = pd.read_csv("dataset.csv")
lat = []
lon = []
date = []
for idx, row in enumerate(df2.iterrows()):
    row = row[1]
    if row.EVENT_ID not in d:
        lat.append(-1)
        lon.append(-1)
        date.append(-1)
    else:
        val = d[row.EVENT_ID]
        lat.append(val[0])
        lon.append(val[1])
        date.append(val[2])
        # d[row.EVENT_ID] = [row.BEGIN_LAT, row.BEGIN_LON, row.BEGIN_DATE]

df2['BEGIN_LAT'] = lat
df2['BEGIN_LON'] = lon
df2['BEGIN_DATE'] = date
df2.to_csv("full.csv")
