# Collecting each of the following features for all the flood incidents in Flood_Incidents.csv

# - Water Body Data: proximity to water bodies
# - Dam data: proximity to dams
# - Lithology Data: Different types of rocks have different porousness

# Other file collects these:
# - Precipitation Data: Antecedent Rainfall Index
# - Elevation Data: is there a water body nearby with elevation higher than city location?
# - Deforestation Data: Trees absorb water and hold soil in place. When they're cut down, erosion increases risk of floods

import os
import numpy as np
import pandas as pd
from tqdm import tqdm
from geojsplit import geojsplit
import matplotlib.path as mpltPath
from WaterBodyTIFHandler import DistanceGetter
from math import cos, asin, e, sqrt, pi


def getSlope(lat, lon):
    base_dir = "data/"
    if float(lat) < 0:
        filename = "S"
    else:
        filename = "N"
        
    lon_letter = ""
    if float(lon) < 0:
        lon_letter = "W"
    else:
        lon_letter = "E"
        
    zero_lat = ""
    if (abs(float(lat)) < 10):
        zero_lat = "0"

    zero_lon = ""
    if (abs(float(lon)) < 100):
        zero_lon = "0"
    if (abs(float(lon)) < 10):
        zero_lon = "00"
        
    filename += f"ASTWBDV001_{zero_lat}{str(abs(int(float(lat))))}{lon_letter}{zero_lon}{str(abs(int(float(lon))))}.tif"
    # print("Converting " + filename)
    if not os.path.isfile(os.path.join(base_dir, filename)):
        print(filename + " not found. Appending -1.")
        return -1

    converter = DistanceGetter(base_dir, filename)
    dist = converter.get_dist(lat, lon)
    return dist

def distance(lat1, lon1, lat2, lon2):
    p = pi/180
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p) * cos(lat2*p) * (1-cos((lon2-lon1)*p))/2
    return 12742 * asin(sqrt(a))

class FeatureCollector():
    def __init__(self):
        self.base_dir = "data"
        self.floods_dir = "data/Flood_Incidents.csv"
        self.dataset_dir = "data/GFIF.csv"
        self.dams_dir = "data/Dams.csv"
        self.litho_dir = "data/litho"
        self.water_dir = "data/water"

        self.floods = pd.read_csv(self.floods_dir)
        self.dataset = pd.read_csv(self.dataset_dir)
    
    def collect_dams(self):
        min_dists = [-1 for _ in range(len(self.floods))]
        self.dams = np.array(pd.read_csv(self.dams_dir))
        
        print("Collecting dam data...")
        for idx, row in tqdm(self.floods.iterrows(), total=len(self.floods), leave=False):
            lat = row['BEGIN_LAT']
            lon = row['BEGIN_LON']
            distances = [distance(lat, lon, damlat, damlon) for damlat, damlon in self.dams]

            min_dists[idx] = np.min(distances)
            # print(min_dists[idx])
            
        self.dataset['DAMS'] = min_dists
        print("Finished!\n")
    
    def collect_water(self):
        for idx, row in tqdm(self.dataset.iterrows(), leave=False, total=len(self.dataset)):
            lat = row["BEGIN_LAT"]
            lon = row["BEGIN_LON"]



    def collect_litho(self):
        print("Collecting litho data...")
        flood_latlons = np.array([self.floods['BEGIN_LAT'], self.floods['BEGIN_LON']]).reshape(-1, 2)
        min_areas = np.zeros(flood_latlons.shape[0])
        min_areas.fill(-1)
        classnames = ["" for _ in range(len(flood_latlons))]

        geojson = geojsplit.GeoJSONBatchStreamer("data/litho.geojson")
        for idx, batch in tqdm(enumerate(geojson.stream(batch=1000)), total=1235400/1000):

            for path in tqdm(batch['features'], leave=False):
                properties = path['properties']
                shapearea = int(properties['Shape_Area'])
                classname = properties['xx']

                path = mpltPath.Path(path['geometry']['coordinates'][0][0])
                inside = path.contains_points(flood_latlons)

                for idx, val in enumerate(inside):
                    if val:
                        if min_areas[idx]==-1 or (min_areas[idx]>0 and shapearea<min_areas[idx]):
                            min_areas[idx] = shapearea
                            classnames[idx] = classname
                            np.delete(flood_latlons, idx)
            tqdm.write(str(len([i for i in classnames if i!=""])/len(classnames)*100))
        self.dataset['LITHO'] = classnames

    
    def to_csv(self, dir):
        self.dataset.to_csv(dir)


collector = FeatureCollector()
collector.collect_dams()
collector.collect_litho()
collector.collect_water()

# export to a Global Flood Incidents and Features dataset
collector.to_csv("data/GFIF.csv")