from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class BudgetPeriod(Base):
    """Stores the global settings for a specific month/year."""
    __tablename__ = "budget_periods"

    id = Column(Integer, primary_key=True, index=True)
    month_year = Column(String, unique=True, index=True) # e.g., "2026-03"
    starting_balance = Column(Float, default=0.0)
    start_date = Column(Date)
    end_date = Column(Date)

    # Relationship to the plans
    plans = relationship("BudgetPlan", back_populates="period")