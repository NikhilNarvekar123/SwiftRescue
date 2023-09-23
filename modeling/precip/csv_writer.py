import pandas as pd

# df = pd.read_csv("../data/Flood_Incidents.csv")
df = pd.read_csv("dataset.csv")
stuff = []

file = open("precips.txt", "r")
content = file.readlines()
d = dict()
precip2 = []
precip1 = []
for line in content:
    parts = line.split(";;")
    eventId = parts[0]
    front = parts[2].split("|||")
    d[eventId] = [parts[1], front[0]]

for idx, row in df.iterrows():
    id = str(row.EVENT_ID)
    if id in d:
        vals = d[id]
        precip2.append(vals[0])
        precip1.append(vals[1])
    else:
        precip2.append(-1)
        precip1.append(-1)

df['precip2'] = precip2
df['precip1'] = precip1
df.to_csv("finished.csv")