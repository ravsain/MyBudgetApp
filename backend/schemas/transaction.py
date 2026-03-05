from pydantic import BaseModel
from datetime import date

class TransactionBase(BaseModel):
    amount: float
    description: str
    date: date
    category_id: int
    budget_period_id: int

class TransactionCreate(TransactionBase):
    pass  # Used when creating a new transaction

class Transaction(TransactionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True