from pydantic import BaseModel

class BudgetPlanBase(BaseModel):
    category_id: int
    budget_period_id: int
    month_year: str
    planned_amount: float

class BudgetPlanCreate(BudgetPlanBase):
    """Schema for creating a new budget plan entry."""
    pass

class BudgetPlan(BudgetPlanBase):
    """Schema for returning budget plan data (includes the DB ID)."""
    id: int

    class Config:
        from_attributes = True