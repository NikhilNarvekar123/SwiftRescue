import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
import csv

cred_obj = firebase_admin.credentials.Certificate(
    "PythonToDB/swiftrescue-1168c-firebase-adminsdk-ufbf8-736f34dcac.json"
)
default_app = firebase_admin.initialize_app(
    cred_obj,
    {"databaseURL": "https://swiftrescue-1168c-default-rtdb.firebaseio.com/"},
)


def pushJson(
    location: str,
    date: str,
    lat: float,
    long: float,
    severity: int,
    status: bool,
    time: int,
):
    floodInstance = {
        "date": date,
        "latitude": lat,
        "longitude": long,
        "severity": severity,
        "status": status,
        "time": time,
    }
    floodInstanceJSON = json.loads(json.dumps(floodInstance))
    ref = db.reference("/warnings/" + location)
    ref.push().set(floodInstanceJSON)


csvFilePath = "PythonToDB\samplecsv.csv"
data = {}
with open(csvFilePath) as csvFile:
    csvReader = csv.DictReader(csvFile)
    i = 1
    for rows in csvReader:
        data[i] = rows
        i += 1

data = json.loads(json.dumps(data))
print(data)
for key, value in data.items():
    pushJson(
        value.get("location"),
        value.get("date"),
        value.get("latitude"),
        value.get("longitude"),
        value.get("severity"),
        value.get("status"),
        value.get("time"),
    )
