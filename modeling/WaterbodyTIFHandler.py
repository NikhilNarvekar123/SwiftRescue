import os
import numpy as np
import matplotlib.pyplot as plt
from osgeo import gdal

def decdeg2dms(dd):
   is_positive = float(dd) >= 0
   dd = abs(float(dd))
   minutes,seconds = divmod(dd*3600,60)
   degrees,minutes = divmod(minutes,60)
   degrees = degrees if is_positive else -degrees
   return (degrees,minutes,seconds)

def dms2decdeg(deg, min, sec):
    return deg+min/60+sec/3600

from math import cos, asin, sqrt, pi

def distance(lat1, lon1, lat2, lon2):
    p = pi/180
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p) * cos(lat2*p) * (1-cos((lon2-lon1)*p))/2
    return 12742 * asin(sqrt(a))

class DistanceGetter:
    def __init__(self, base_dir, filename):
        self.base_dir = base_dir
        
        self.filename = filename
        self.file = gdal.Open(os.path.join(self.merc_dir, self.filename))
        self.data = self.file.GetRasterBand(1).ReadAsArray()
        
    def get_dist(self, lat, lon):
        # fixed this so that it properly gets from mercator projection
        # get array idx from dms, and then use proportions to get same bbox in mercator projected

        lat_degs, lat_mins, lat_secs = decdeg2dms(lat)
        lon_degs, lon_mins, lon_secs = decdeg2dms(lon)

        lat_secs += 60 * lat_mins
        lon_secs += 60 * lon_mins

        # convert from seconds to x/y for array indexing
        x = int(lon_secs)
        y = 3601 - int(lat_secs)
        point = self.data[y,x]

        height = len(self.data)
        width = len(self.data[0])
        mindist=1e3

        for i in range(len(self.data)):
            for j in range(len(self.data[i])):
                howfar = distance(dms2decdeg(lat_degs, lat_mins, lat_secs), dms2decdeg(lon_degs, lon_mins, lon_secs), 
                dms2decdeg(lat_degs, lat_mins, lat_secs+j), dms2decdeg(lon_degs, lon_mins, lon_secs+i))
                if self.data[i][j]>0 and howfar<mindist:
                    mindist=howfar
        return mindist