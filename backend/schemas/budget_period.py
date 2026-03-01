from pydantic import BaseModel
from datetime import date
from typing import Optional

class BudgetPeriodBase(BaseModel):
    month_year: str
    starting_balance: float
    start_date: date
    end_date: date

class BudgetPeriodCreate(BudgetPeriodBase):
    pass

class BudgetPeriod(BudgetPeriodBase):
    id: int

    class Config:
        from_attributes = True