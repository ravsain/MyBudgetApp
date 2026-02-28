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

    category = relationship("Category", back_populates="transactions")
    user = relationship("User", back_populates="transactions")