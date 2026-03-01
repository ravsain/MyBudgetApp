
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend import models, schemas
from backend.database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.BudgetPeriod)
def create_or_update_budget_period(
    period: schemas.BudgetPeriodCreate, 
    db: Session = Depends(get_db)
):
    # Check if this month already exists
    db_period = db.query(models.BudgetPeriod).filter(
        models.BudgetPeriod.month_year == period.month_year
    ).first()
    
    if db_period:
        # Update existing month logic (Upsert)
        for key, value in period.model_dump().items():
            setattr(db_period, key, value)
    else:
        # Create new month logic
        db_period = models.BudgetPeriod(**period.model_dump())
        db.add(db_period)
    
    db.commit()
    db.refresh(db_period)
    return db_period

@router.get("/{month_year}", response_model=schemas.BudgetPeriod)
def get_budget_period(month_year: str, db: Session = Depends(get_db)):
    db_period = db.query(models.BudgetPeriod).filter(
        models.BudgetPeriod.month_year == month_year
    ).first()
    if not db_period:
        raise HTTPException(status_code=404, detail="Budget period not found")
    return db_period