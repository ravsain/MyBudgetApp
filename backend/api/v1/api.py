from fastapi import APIRouter
from backend.api.v1.endpoints import transactions, categories, budget_period, budget_plan

api_router = APIRouter()

# Here we assign 'tags' so they are grouped nicely in the /docs page
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(budget_period.router, prefix="/budget-periods", tags=["Budget Periods"])
api_router.include_router(budget_plan.router, prefix="/budget-plans", tags=["Budget Plans"])