from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from backend.database import Base

class Category(Base):
    """Customizable Income/Expense categories linked to a Home."""
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    home_id = Column(Integer, ForeignKey("homes.id"))
    name = Column(String)
    type = Column(String)  # 'Income' or 'Expense'

    home = relationship("Home", back_populates="categories")
    plans = relationship("BudgetPlan", back_populates="category")
    transactions = relationship("Transaction", back_populates="category")

class BudgetPlan(Base):
    """The 'Planned' amounts from your spreadsheet summary."""
    __tablename__ = "budget_plans"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    budget_period_id = Column(Integer, ForeignKey("budget_periods.id"))
    month_year = Column(String)  # e.g., "2026-03"
    planned_amount = Column(Float, default=0.0)

    category = relationship("Category", back_populates="plans")
    period = relationship("BudgetPeriod", back_populates="plans")
