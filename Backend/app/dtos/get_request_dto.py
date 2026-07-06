from pydantic import BaseModel, model_validator
import datetime



class GetParams(BaseModel):
    frequency: str

    capacity: bool = False
    outage: bool = False
    percentOutage: bool = False

    dateFrom: datetime.date | None = None
    dateTo: datetime.date | None = None



    @model_validator(mode="after")
    def validate_data(self):
        if not any([
            self.capacity,
            self.outage,
            self.percentOutage
        ]):
            raise ValueError("Choose at least 1 parameter")
        

        return self