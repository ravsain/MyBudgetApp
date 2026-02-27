from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from backend.database import Base

class Home(Base):
    """A household group that shares one budget."""
    __tablename__ = "homes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)  # e.g., "Sharma Household"
    
    # Relationships
    users = relationship("User", back_populates="home")
    categories = relationship("Category", back_populates="home")
    settings = relationship("UserSetting", back_populates="home", uselist=False)

class User(Base):
    """The individual user accounts."""
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    home_id = Column(Integer, ForeignKey("homes.id"))
    
    home = relationship("Home", back_populates="users")
    transactions = relationship("Transaction", back_populates="user")

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
    month_year = Column(String)  # e.g., "2026-03"
    planned_amount = Column(Float, default=0.0)

    category = relationship("Category", back_populates="plans")

class Transaction(Base):
    """The daily logs of spending or earning."""
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    user_id = Column(Integer, ForeignKey("users.id")) # Who made the transaction
    amount = Column(Float)
    description = Column(String)
    date = Column(Date)

    category = relationship("Category", back_populates="transactions")
    user = relationship("User", back_populates="transactions")

class UserSetting(Base):
    """Global settings for the shared dashboard."""
    __tablename__ = "user_settings"
    id = Column(Integer, primary_key=True, index=True)
    home_id = Column(Integer, ForeignKey("homes.id"))
    starting_balance = Column(Float, default=0.0)
    currency = Column(String, default="INR")
    show_graphs = Column(Boolean, default=True)
    theme_color = Column(String, default="#ff5722") # Orange from your sheet

    home = relationship("Home", back_populates="settings")