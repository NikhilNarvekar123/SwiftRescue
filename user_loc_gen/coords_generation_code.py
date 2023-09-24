
import numpy as np


import pandas as pd

# Load the datasets
county_population_data = pd.read_csv("/mnt/data/county_population_by_race.csv")
uscounties_data = pd.read_csv("/mnt/data/uscounties.csv")

# Process county names for merging
county_population_data['county_processed'] = county_population_data['county'].str.split(',').str[0].str.strip()
county_population_data['state_name'] = county_population_data['county'].str.split(',').str[1].str.strip()

# Merge the datasets
merged_data = pd.merge(county_population_data, uscounties_data, 
                       left_on=['county_processed', 'state_name'], right_on=['county_full', 'state_name'], how='inner')

# Convert population column to numeric
merged_data['total_population_of_one_race'] = pd.to_numeric(merged_data['total_population_of_one_race'].str.replace(',', ''), errors='coerce')

# Calculate the number of simulated locations
merged_data['simulated_locations'] = (merged_data['total_population_of_one_race'] / 10000).round().astype(int)

# Generate simulated coordinates
simulated_coords = []
for index, row in merged_data.iterrows():
    for _ in range(row['simulated_locations']):
        lat_offset = np.random.normal(0, 0.05)
        lng_offset = np.random.normal(0, 0.05)
        
        simulated_lat = row['lat'] + lat_offset
        simulated_lng = row['lng'] + lng_offset
        
        simulated_coords.append((simulated_lat, simulated_lng))


import matplotlib.pyplot as plt

# Extract latitudes and longitudes
latitudes = [coord[0] for coord in simulated_coords]
longitudes = [coord[1] for coord in simulated_coords]

# Plot the coordinates
plt.scatter(longitudes, latitudes, s=5, alpha=0.5)
plt.show()
