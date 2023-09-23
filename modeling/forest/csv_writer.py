import pandas as pd

# df = pd.read_csv("../data/Flood_Incidents.csv")
df = pd.read_csv("../street/concat.csv")
stuff = []

file = open("forestQuick.txt", "r")
content = file.readlines()
d = dict()
for line in content:
    parts = line.split(";;")
    eventId = parts[0]
    front = parts[2].split("||||")
    d[eventId] = [parts[1], front[0]]
    # print(parts, front[0])
    # print(d)
    # break
for idx, row in df.iterrows():
    if idx > 5000:
        break
    id = str(row.EVENT_ID)
    if id in d:
        vals = d[id]
        a = 0
        if vals[0] == "TRUE":
            a = 1
        stuff.append([id, row.osm, a, vals[1]])
    else:
        stuff.append([id, row.osm, -1, -1])
df2 = pd.DataFrame(stuff, columns=["EVENT_ID", "osm", "forest", "forest_year"])
df2.to_csv("forest_dat2.csv")
