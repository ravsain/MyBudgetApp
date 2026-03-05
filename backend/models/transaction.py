from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from backend.database import Base


class Transaction(Base):
    """The daily logs of spending or earning."""
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    user_id = Column(Integer, ForeignKey("users.id")) # Who made the transaction
    amount = Column(Float)
    description = Column(String)
    date = Column(Date)
    budget_period_id = Column(Integer, ForeignKey("budget_periods.id"), index=True) # Optional link to a budget period for easier querying

    category = relationship("Category", back_populates="transactions")
    user = relationship("User", back_populates="transactions")
    budget_period = relationship("BudgetPeriod", back_populates="transactions")