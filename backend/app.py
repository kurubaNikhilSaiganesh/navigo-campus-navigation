from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin
# TODO: Provide the path to your Firebase service account key JSON file
cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH', 'serviceAccountKey.json')
if os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
else:
    print(f"Warning: Firebase credentials not found at {cred_path}. Firestore will not be available.")
    db = None
app = FastAPI(title="Campus Nav API")

# Allow CORS for local React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")

def read_data():
    if not os.path.exists(DATA_FILE):
        return {"events": [], "classes": []}
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

from typing import Dict, Any

@app.get("/")
def read_root():
    return {"message": "Welcome to Campus Nav API"}

@app.get("/api/events")
def get_events():
    data = read_data()
    return data.get("events", [])

@app.get("/api/classes")
def get_classes():
    data = read_data()
    return data.get("classes", [])

@app.post("/api/events")
def create_event(event: Dict[str, Any]):
    data = read_data()
    events = data.setdefault("events", [])
    events.append(event)
    write_data(data)
    return event

@app.post("/api/classes")
def create_class(cls: Dict[str, Any]):
    data = read_data()
    classes = data.setdefault("classes", [])
    classes.append(cls)
    write_data(data)
    return cls
