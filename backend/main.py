from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend import models, schemas
from backend.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency to get database access
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. GET: List all transactions (The table in your sheet)
@app.get("/transactions/", response_model=List[schemas.Transaction])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions

# 2. POST: Add a new transaction (The entry form)
@app.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    # For now, we manually assign to User 1 and Home 1 until we build Login
    db_transaction = models.Transaction(**transaction.model_dump(), user_id=1)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# 1. GET: List all categories (to fill the dropdown)
@app.get("/categories/", response_model=List[schemas.Category])
def read_categories(db: Session = Depends(get_db)):
    # In a real app, we would filter by home_id
    return db.query(models.Category).all()

# 2. POST: Add a new category (for the "Custom Category" feature)
@app.post("/categories/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = models.Category(**category.model_dump(), home_id=1)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category