from scipy.spatial.distance import euclidean
from haversine import haversine
from scipy.spatial import distance_matrix
import itertools
from fastapi import FastAPI, HTTPException
from typing import List, Tuple
import networkx as nx
import json
import fastapi
import os
import modal
import urllib
import urllib3
from urllib.parse import unquote
from fastapi import FastAPI, HTTPException
from typing import List
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import pairwise_distances_argmin_min


image = modal.Image.debian_slim().pip_install_from_requirements("requirements.txt")

stub = modal.Stub("swift-rescue", image=image)


@stub.function(keep_warm=1)
@modal.web_endpoint(method="POST")
async def compute_clusters(request: fastapi.Request):
    """
    Computes clusters from user locations using k_means
    """
    body = await request.body()
    body = unquote(body.decode("utf-8"))
    body = json.loads(body)
    coordinates = body["coordinates"]
    k = body["k"]

    if k <= 0 or len(coordinates) < k:
        raise HTTPException(status_code=400, detail="Invalid input")
    
    # Convert input coordinates to NumPy array
    data = np.array(coordinates)

    # Perform K-means clustering
    kmeans = KMeans(n_clusters=k, random_state=0)
    kmeans.fit(data)

    # Get cluster locations
    cluster_centers = kmeans.cluster_centers_

    # Find the closest points to each cluster center
    closest_points, _ = pairwise_distances_argmin_min(data, cluster_centers)

    # Create a dictionary to store the results
    results = {
        "cluster_locations": cluster_centers.tolist(),
        "closest_points": {
            0: closest_points.tolist()
        }
    }
    
    return results


def nearest_neighbor_tsp(dist_matrix, start_idx):
    num_nodes = dist_matrix.shape[0]
    unvisited = set(range(num_nodes))
    unvisited.remove(start_idx)
    tsp_path = [start_idx]

    while unvisited:
        current_node = tsp_path[-1]
        nearest_neighbor = min(unvisited, key=lambda node: dist_matrix[current_node, node])
        tsp_path.append(nearest_neighbor)
        unvisited.remove(nearest_neighbor)

    tsp_path.append(start_idx)
    return tsp_path


@stub.function(keep_warm=1)
@modal.web_endpoint(method="POST")
async def find_shortest_path(
    request: fastapi.Request,
):
    
    body = await request.body()
    body = unquote(body.decode("utf-8"))
    body = json.loads(body)
    
    coordinates = body["cluster_coordinates"]
    start_coord = tuple(body["start_coord"])
    end_coord = tuple(body["end_coord"])

    print('get request for shortest path')
    print("coords:", str(coordinates))
    print("start:", str(start_coord), " | end:", str(end_coord))

    coordinates = [tuple(coord) for coord in coordinates]


    # Check if start and end coordinates are in the set of coordinates
    if start_coord not in coordinates or end_coord not in coordinates:
        raise HTTPException(status_code=400, detail="Start or end coordinate not found in the set")

# Create a graph using NetworkX
    G = nx.Graph()

    # Add nodes to the graph
    for i, coord in enumerate(coordinates):
        G.add_node(i, pos=coord)

    # Compute pairwise distances
    dist_matrix = distance_matrix(coordinates, coordinates)

    # Add edges between nodes based on distances
    for i in range(len(coordinates)):
        for j in range(i + 1, len(coordinates)):
            distance = euclidean(coordinates[i], coordinates[j])
            G.add_edge(i, j, weight=distance)

    # Find the nearest neighbor tour starting from the specified point
    start_idx = coordinates.index(start_coord)
    tsp_path_indices = nearest_neighbor_tsp(dist_matrix, start_idx)
    tsp_path_coordinates = [coordinates[i] for i in tsp_path_indices]

    # Calculate the total path length
    # since every point is a lat, long pair, we can't use euclidean distance
    # instead, we use the haversine distance
    total_length = 0
    for i in range(len(tsp_path_indices) - 1):
        total_length += haversine(tsp_path_coordinates[i], tsp_path_coordinates[i + 1])

    # Convert the path indices to coordinates
    tsp_path_coordinates = [coordinates[i] for i in tsp_path_indices]

    return {"shortest_path": tsp_path_coordinates, "shortest_path_length": total_length}


if __name__ == "__main__":
    stub.serve()
