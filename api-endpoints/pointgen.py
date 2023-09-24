import random

with open("datafile.txt", "w") as f:
    n=100
    coords=[[random.random(), random.random()] for i in range(n)]
    obj = {
    "coordinates": coords,
    "start_coord": coords[0],
    "end_coord": coords[-1]
    }
    f.write(str(obj).replace("'", '"'))