import random
import pandas as pd

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
import csv

cred_obj = firebase_admin.credentials.Certificate(
    "swiftrescue-1168c-firebase-adminsdk-ufbf8-736f34dcac.json"
)
default_app = firebase_admin.initialize_app(
    cred_obj,
    {"databaseURL": "https://swiftrescue-1168c-default-rtdb.firebaseio.com/"},
)



# load harris_county_centroids.csv and harris_county_points.csv
harris_county_points = pd.read_csv('harris_county_points.csv')

# pick random 5000 points from harris_county_points
harris_county_points = harris_county_points.sample(n=5000)

# iterate over it, and push each row to firebase
fbobj = {
        str(random.randint(0, 100000000)): {
        "age": random.randint(18, 80),
        "location": {
            "lat": row['Latitude'],
            "long": row['Longitude']
        },
        "name": random.choice(open('names.txt').readlines()).strip(),
        "notes": random.choice(open('notes.txt').readlines()).strip(),
        "phone": random.choice(["972", "713", "281", "832"]) + "-" + str(random.randint(100, 999)) + "-" + str(random.randint(1000, 9999)),
        "pw": "password",
        } for index, row in list(harris_county_points.iterrows())
    }

# push to firebase
fbobj = json.loads(json.dumps(fbobj))
ref = db.reference("/users/")
ref.set(fbobj)
