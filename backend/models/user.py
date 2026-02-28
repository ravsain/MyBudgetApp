from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    """The individual user accounts."""
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    home_id = Column(Integer, ForeignKey("homes.id"))
    
    home = relationship("Home", back_populates="users")
    transactions = relationship("Transaction", back_populates="user")