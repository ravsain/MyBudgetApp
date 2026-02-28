from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Note: We import Base from models to ensure all tables are registered
from backend.models import Base
from backend.database import engine
from backend.api.v1.api import api_router

# 1. Create Database Tables
# This triggers the creation of ALL tables (Home, User, Transaction, etc.)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Pro Budget App", 
    version="1.0.0",
    description="Scalable finance backend"
)

# 2. Handle CORS (Essential for React Integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Include Routers
# All your modular endpoints now live under /api/v1/...
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {
        "status": "active", 
        "message": "Scalable Backend is running",
        "docs": "/docs"
    }

# @app.delete("/api/v1/transactions/{transaction_id}")
# def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
#     db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
#     if not db_transaction:
#         raise HTTPException(status_code=404, detail="Transaction not found")
#     db.delete(db_transaction)
#     db.commit()
#     return {"message": "Deleted successfully"}