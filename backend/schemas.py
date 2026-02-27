from pydantic import BaseModel
from datetime import date
from typing import Optional

class TransactionBase(BaseModel):
    amount: float
    description: str
    date: date
    category_id: int

class TransactionCreate(TransactionBase):
    pass  # Used when creating a new transaction

class Transaction(TransactionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    type: str  # 'Income' or 'Expense'

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    home_id: int

    class Config:
        from_attributes = True