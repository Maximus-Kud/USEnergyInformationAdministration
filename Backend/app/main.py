import os
import requests

from fastapi import FastAPI, Depends
from dotenv import load_dotenv

from app.dtos.get_request_dto import GetParams





load_dotenv()

API_KEY = os.getenv("API_KEY")

BASE_URL = "https://api.eia.gov/v2/nuclear-outages/us-nuclear-outages/data/"


params = [
    "frequency",
    "data",
    "start",
    "end"
]


data_params = [
    "capacity",
    "outage",
    "percentOutage"
]



def call_api(params: dict) -> dict:
    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()


    return response.json()["response"]





app = FastAPI(title="US EIA (Energy Information Administration)")


@app.get("/data")
async def get_data(input: GetParams = Depends()):
    data = []

    if input.capacity: data.append("capacity")
    if input.outage: data.append("outage")
    if input.percentOutage: data.append("percentOutage")

    params = {
        "api_key": API_KEY,
        "frequency": input.frequency,
        "data[]": data,

        "start": input.dateFrom.isoformat() if input.dateFrom else None,
        "end": input.dateTo.isoformat() if input.dateTo else None,
    }


    return call_api(params)