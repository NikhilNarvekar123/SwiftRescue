import pandas as pd

df = pd.read_csv("concat.csv")

stuff = set()
cnt = 0
for idx, row in enumerate(df.iterrows()):
    row = row[1]
    stuff.add(row.EVENT_ID)
    if(row.osm == -1):
        cnt += 1

print(len(stuff))
print(cnt, "-1s")