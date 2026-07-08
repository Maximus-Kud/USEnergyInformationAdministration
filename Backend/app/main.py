import os
import requests

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from app.dtos.get_request_dto import GetParams





load_dotenv()

API_KEY = os.getenv("API_KEY")

BASE_URL = "https://api.eia.gov/v2/nuclear-outages/"



def call_api(route: str, params: dict) -> dict:
    response = requests.get(BASE_URL + route, params=params)
    response.raise_for_status()


    return response.json()["response"]





app = FastAPI(title="US EIA (Energy Information Administration)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/nuclear-outages")
async def get_nuclear_outages_data(input: GetParams = Depends()):
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


    return call_api("us-nuclear-outages/data/", params)



@app.get("/generator-level-outages")
async def get_generator_level_outages_data(input: GetParams = Depends()):
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


    return call_api("generator-nuclear-outages/data/", params)



@app.get("/facility-level-outages")
async def get_facility_level_outages_data(input: GetParams = Depends()):
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


    return call_api("facility-nuclear-outages/data/", params)