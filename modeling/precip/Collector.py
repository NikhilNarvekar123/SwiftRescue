import requests
import os
import datetime
from dateutil import parser
from DataExtractor import DataExtractor


class Collector:
    def __init__(self, lat, lon, date):
        # self.apikey = "bec034e0178f4c6e9a153147212504"
        # self.apikey = "0c102304d8a143219b362618212504"
        self.apikey = "2952c57ad6634f3fa0372814212504"
        self.api_format = 'http://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=' + \
            self.apikey + '&date='
        self.lat = lat
        self.lon = lon
        self.date = date
        self.oID = lat + "," + lon

    def getData(self):
        file_names, params = self.gen_query(self.lat, self.lon, self.date)
        file_names.reverse()
        params.reverse()
        # print("F: " ,file_names)
        weather = []
        for file_name, param in zip(file_names, params):
            api_call = self.api_format + param
            resp = requests.get(api_call)
            d = DataExtractor(self.oID, resp.content)
            # print(d.maxPrecip(), ":", resp.content)
            # print(d.maxPrecip(), end = ' ')
            weather.append(str(d.maxPrecip()))
            # weather.extend([d.maxPrecip(), d.maxTemp(),    d.maxAirPressure(), d.maxHumidity(), d.maxWind()])
        # print()
        return weather

    def gen_query(self, lat, lon, date, days_in_advance=2):
        date_list = []
        params_list = []
        for i in range(0, days_in_advance):
            temp_date = str(parser.parse(date) - datetime.timedelta(i))[:10]
            date_list.append(temp_date)
            params_list.append(temp_date+"&q="+lat+","+lon)
        return (date_list, params_list)

    def format_date(self, s):
        return s.replace("/", "-")
