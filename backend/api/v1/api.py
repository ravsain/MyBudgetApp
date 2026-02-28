from fastapi import APIRouter
from backend.api.v1.endpoints import transactions, categories

api_router = APIRouter()

# Here we assign 'tags' so they are grouped nicely in the /docs page
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])