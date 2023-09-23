# Collecting each of the following features for all the flood incidents in Flood_Incidents.csv

# - Water Body Data: proximity to water bodies
# - Precipitation Data: Antecedent Rainfall Index
# - Dam data: proximity to dams
# - Elevation Data: is there a water body nearby with elevation higher than city location?
# - Deforestation Data: Trees absorb water and hold soil in place. When they're cut down, erosion increases risk of floods
# - Lithology Data: Different types of rocks have different porousness

import os
import numpy as np
import pandas as pd
from tqdm import tqdm


class FeatureCollector():
    def __init__(self):
        self.base_dir = "data"
        self.floods_dir = "data/Flood_Incidents.csv"
        self.dams_dir = "data/Dams.csv"
        self.elevation_dir = "data/elevation"
        self.forest_dir = "data/forest"
        self.litho_dir = "data/litho"
        self.precip_dir = "data/precip"

        self.floods = pd.read_csv(self.floods_dir)
        self.dataset = self.floods.copy()
    
    def collect_dams(self):
        self.dams = pd.read_csv(self.dams_dir)
        print("Collecting dam data")
        for idx, row in tqdm(self.dams.iterrows(), leave=False):


collector = FeatureCollector()
collector.collect_dams()

# export to a Global Flood Incidents and Features dataset
collector.to_csv("data/GFIF.csv")