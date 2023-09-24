import numpy as np
import rasterio
import matplotlib.pyplot as plt
import networkx as nx
from scipy.spatial import distance_matrix
from tqdm import tqdm

# Load data from CSV files
data_points = np.loadtxt("harris_county_points_no_pandas.csv", delimiter=',', skiprows=1)
centroids = np.loadtxt("harris_county_centroids.csv", delimiter=',', skiprows=1)

# Compute distance matrix for the centroids
dist_matrix = distance_matrix(centroids, centroids)

# Create a graph using the centroids
G = nx.Graph()
for i in tqdm(range(len(centroids))):
    for j in range(len(centroids)):
        if i != j:
            G.add_edge(i, j, weight=dist_matrix[i, j])

# Identify the top-left and top-right centroids
top_left_index = np.argmin(centroids[:, 0] + centroids[:, 1])
top_right_index = np.argmax(centroids[:, 0] - centroids[:, 1])

# Compute the shortest paths using Dijkstra's algorithm
path_left = nx.shortest_path(G, source=top_left_index, weight='weight')
path_right = nx.shortest_path(G, source=top_right_index, weight='weight')

# Corrected bounds calculation
with rasterio.open("usa_pd_2020_1km_UNadj.tif") as src:
    harris_cropped = src.read(1, window=rasterio.windows.from_bounds(-95.822902, 29.497750, -94.990498, 30.038582, transform=src.transform))
    left, bottom, right, top = rasterio.windows.bounds(rasterio.windows.from_bounds(-95.822902, 29.497750, -94.990498, 30.038582, transform=src.transform), transform=src.transform)

# Visualize the results
fig, ax = plt.subplots(figsize=(12, 12))
ax.imshow(np.log1p(harris_cropped), cmap='viridis', extent=[left, right, bottom, top], origin='upper')
ax.scatter(centroids[:, 0], centroids[:, 1], c='red', marker='X', s=100)

# Plotting the paths between centroids for path_left
for i in range(len(path_left)-1):
    start = centroids[int(path_left[i])]
    end = centroids[int(path_left[i+1])]
    ax.plot([start[0], end[0]], [start[1], end[1]], color='blue', linewidth=1)

# Plotting the paths between centroids for path_right
for i in range(len(path_right)-1):
    start = centroids[int(path_right[i])]
    end = centroids[int(path_right[i+1])]
    ax.plot([start[0], end[0]], [start[1], end[1]], color='green', linewidth=1)

plt.show()
