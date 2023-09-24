import rasterio
import numpy as np

import numpy as np
import rasterio
from shapely.geometry import Point
import random
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from scipy.spatial import distance
import heapq

# Define the bounding box coordinates for Harris County in WGS84
harris_minx, harris_miny = -95.822902, 29.497750   # Bottom-left corner
harris_maxx, harris_maxy = -94.990498, 30.038582   # Top-right corner

# Define the scale factor of 1 point per 500 people
scale_factor_500 = 1/500

# Define the function to generate fake people points for a specific pixel with a given scale factor
def generate_points_for_pixel_scaled(row, col, value, transform, scale_factor):
    num_points = int(value * scale_factor)
    x_min, y_max = rasterio.transform.xy(transform, row, col)
    x_max, y_min = rasterio.transform.xy(transform, row+1, col+1)
    points = []
    for _ in range(num_points):
        x = random.uniform(x_min, x_max)
        y = random.uniform(y_min, y_max)
        points.append(Point(x, y))
    return points

# Define Dijkstra's shortest path algorithm
def dijkstra(graph, start):
    shortest_path = {}
    predecessor = {}
    unseen_nodes = graph
    infinity = float('inf')
    path = []
    for node in unseen_nodes:
        shortest_path[node] = infinity
    shortest_path[start] = 0
    while unseen_nodes:
        min_node = None
        for node in unseen_nodes:
            if min_node is None:
                min_node = node
            elif shortest_path[node] < shortest_path[min_node]:
                min_node = node
        for child_node, weight in graph[min_node].items():
            if weight + shortest_path[min_node] < shortest_path[child_node]:
                shortest_path[child_node] = weight + shortest_path[min_node]
                predecessor[child_node] = min_node
        unseen_nodes.pop(min_node)
    current_node = start
    while current_node != None:
        try:
            path.insert(0, current_node)
            current_node = predecessor[current_node]
        except KeyError:
            break
    return path

print("Starting data generation...")

# Generate the fake people points for Harris County with the 500 to 1 scale factor
fake_people_points_harris_500 = []
with rasterio.open("./usa_pd_2020_1km_UNadj.tif") as src:
    harris_bbox = rasterio.windows.from_bounds(harris_minx, harris_miny, harris_maxx, harris_maxy, src.transform)
    harris_cropped = src.read(1, window=harris_bbox)
    harris_cropped[harris_cropped < 0] = 0
    for row in range(harris_cropped.shape[0]):
        for col in range(harris_cropped.shape[1]):
            pixel_value = harris_cropped[row, col]
            fake_people_points_harris_500.extend(generate_points_for_pixel_scaled(row, col, pixel_value, src.window_transform(harris_bbox), scale_factor_500))

print("Data generation complete!")
print("Starting clustering process...")

# Extract X and Y coordinates of the fake people points for clustering
data_for_clustering = np.array(list(zip([point.x for point in fake_people_points_harris_500], [point.y for point in fake_people_points_harris_500])))

# Use K-means to cluster the data into 4 clusters
kmeans = KMeans(n_clusters=4, init='k-means++', max_iter=300, n_init=10, random_state=0)
clustered_data = kmeans.fit_predict(data_for_clustering)
centroids = kmeans.cluster_centers_

print("Clustering complete!")
print("Constructing graph...")

# Construct a graph with centroids as nodes and Euclidean distances as weights between nodes
graph = {}
for i, centroid1 in enumerate(centroids):
    graph[i] = {}
    for j, centroid2 in enumerate(centroids):
        if i != j:
            graph[i][j] = distance.euclidean(centroid1, centroid2)

print("Graph construction complete!")
print("Computing optimal path using Dijkstra's algorithm...")

# Compute the optimal path using Dijkstra's algorithm
start_cluster_index = np.argmax(centroids[:, 1])
optimal_path = dijkstra(graph, start_cluster_index)

print("Optimal path computation complete!")
print("Optimal path through clusters:", optimal_path)

# Save the data for download
np.savetxt("clustered_data.csv", data_for_clustering, delimiter=",")
np.savetxt("centroids.csv", centroids, delimiter=",")

print("Data saved for download!")
