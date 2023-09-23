from operator import neg
from numpy.linalg.linalg import det
import pandas as pd
import os
from tqdm import tqdm

# combine csvs for different years into one csv for storms
detdfs = {}
floodcsv = [os.path.join("data", i) for i in os.listdir("data") if "details" in i]
for csvname in tqdm(floodcsv, leave=False):
    year = csvname.split("_")[3][1:]
    detdfs[year] = pd.read_csv(csvname, low_memory=False)
detdf = pd.concat(detdfs)

# filter out storms by event (flood) and keep relevant features
detdf = detdf[(detdf['EVENT_TYPE']=="Flash Flood") | (detdf['EVENT_TYPE']=="Flood")]
detdf = detdf[['BEGIN_YEARMONTH', 'BEGIN_DAY', 'BEGIN_TIME', 'END_YEARMONTH',
       'END_DAY', 'EVENT_ID', 'END_TIME', "EVENT_TYPE", "DAMAGE_PROPERTY", "DAMAGE_CROPS", "DEATHS_DIRECT", "DEATHS_INDIRECT", "INJURIES_DIRECT", "INJURIES_INDIRECT", "BEGIN_LAT", "BEGIN_LON", "END_LAT", "END_LON"]]

# drop bad data and reset index
detdf.dropna(inplace=True)
detdf.to_csv("data/detdf.csv")

# create BEGIN_DATE, END_DATE columns; combine deaths and injuries; combine damage property and crops
bdates = []
edates = []
affected = []
damage = []
for idx, row in tqdm(detdf.iterrows(), leave=False, total=len(detdf)):
    bdates.append(f"{str(row['BEGIN_YEARMONTH'])[4:]}/{str(row['BEGIN_YEARMONTH'])[:4]}/{row['BEGIN_DAY']}")
    edates.append(f"{str(row['END_YEARMONTH'])[4:]}/{str(row['END_YEARMONTH'])[:4]}/{row['END_DAY']}")
    affected.append(row["DEATHS_DIRECT"]+row["DEATHS_INDIRECT"]+row["INJURIES_DIRECT"]+row["INJURIES_INDIRECT"])

    crops = row["DAMAGE_CROPS"]
    property = row["DAMAGE_PROPERTY"]

    # deal with postfixes in money
    if crops[-1]=="K":
        crops = float(crops[:-1])*1e3
    elif crops[-1]=="M":
        crops = float(crops[:-1])*1e6
    elif crops[-1]=="B":
        crops = float(crops[:-1])*1e9

    if property[-1]=="K":
        property = float(property[:-1])*1e3
    elif property[-1]=="M":
        property = float(property[:-1])*1e6
    elif property[-1]=="B":
        property = float(property[:-1])*1e9

    damage.append(float(crops)+float(property))

# create the dataframe rows
detdf['BEGIN_DATE'] = bdates
detdf['END_DATE'] = edates
detdf['AFFECTED'] = affected
detdf['DAMAGE'] = damage
detdf['LABEL'] = [1 for _ in range(len(detdf))]

# drop not needed columns now
detdf.drop(["BEGIN_YEARMONTH", "BEGIN_DAY", "END_YEARMONTH", "END_DAY", "DEATHS_DIRECT", 
"DEATHS_INDIRECT", "INJURIES_DIRECT", "INJURIES_INDIRECT", "DAMAGE_CROPS", "EVENT_TYPE",
"DAMAGE_PROPERTY"], axis="columns", inplace=True)

print("detdf length: ", len(detdf))
print(detdf.head(3))
print("detdf columns: ", list(detdf.columns))


# load in negative data, keeping only date, lat, lon
negative_data = pd.read_csv("data/Non_Flood_Data.csv", low_memory=False)
negative_data = negative_data[negative_data["flood"]==0]
negative_data = negative_data[["date", "lat", "lon"]]

# rename columns to match detdf; put placeholders for other columns
negative_data.rename({"date": "BEGIN_DATE", "lat": "BEGIN_LAT", "lon": "BEGIN_LON"}, inplace=True)

negative_data['BEGIN_DATE'] = negative_data['date'].copy()
negative_data['BEGIN_LAT'] = negative_data['lat'].copy()
negative_data['BEGIN_LON'] = negative_data['lon'].copy()
negative_data['AFFECTED'] = [0 for _ in range(len(negative_data))]
negative_data['DAMAGE'] = [0.0 for _ in range(len(negative_data))]
negative_data['END_DATE'] = ["-" for _ in range(len(negative_data))]
negative_data['LABEL'] = [0 for _ in range(len(negative_data))]

negative_data.drop(["date", "lat", "lon"], inplace=True, axis="columns")
cut = 5000

# cut detdf at negative data length and merge the two
detdf = detdf[:cut]
negative_data = negative_data[:cut]

detdf.reset_index(drop=True, inplace=True)
negative_data.reset_index(drop=True, inplace=True)

dataset = pd.concat([detdf, negative_data])
dataset.reset_index(drop=True, inplace=True)

dataset.to_csv("data/Flood_Incidents.csv")