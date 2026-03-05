from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, schemas
from backend.database import get_db

router = APIRouter()

@router.post("/bulk", response_model=List[schemas.BudgetPlanCreate])
def create_budget_plans_bulk(
    plans: List[schemas.BudgetPlanCreate], 
    db: Session = Depends(get_db)
):
    db_plans = []
    for plan_data in plans:
        # Check if a plan already exists for this category and period to avoid duplicates
        existing_plan = db.query(models.BudgetPlan).filter(
            models.BudgetPlan.category_id == plan_data.category_id,
            models.BudgetPlan.budget_period_id == plan_data.budget_period_id
        ).first()

        if existing_plan:
            # Update existing instead of creating new
            existing_plan.planned_amount = plan_data.planned_amount
            db_plans.append(existing_plan)
        else:
            # Create new entry
            new_plan = models.BudgetPlan(**plan_data.dict())
            db.add(new_plan)
            db_plans.append(new_plan)
    
    try:
        db.commit()
        # Refresh all objects to get IDs back
        for p in db_plans:
            db.refresh(p)
        return db_plans
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/plans/{period_id}", response_model=List[schemas.BudgetPlan])
def get_plans_by_period(period_id: int, db: Session = Depends(get_db)):
    # Look for all rows matching this period
    plans = db.query(models.BudgetPlan).filter(models.BudgetPlan.budget_period_id == period_id).all()
    
    # Return the list (will be empty [] if none exist, which is fine)
    return plans