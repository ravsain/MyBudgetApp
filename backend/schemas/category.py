from pydantic import BaseModel
from datetime import date
from typing import Optional

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