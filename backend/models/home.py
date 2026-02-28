from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Home(Base):
    """A household group that shares one budget."""
    __tablename__ = "homes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String) # e.g., "Sharma Household"
    
    users = relationship("User", back_populates="home")
    categories = relationship("Category", back_populates="home")
    settings = relationship("UserSetting", back_populates="home", uselist=False)

class UserSetting(Base):
    __tablename__ = "user_settings"
    id = Column(Integer, primary_key=True, index=True)
    home_id = Column(Integer, ForeignKey("homes.id"))
    starting_balance = Column(Float, default=0.0)
    currency = Column(String, default="INR")
    show_graphs = Column(Boolean, default=True)
    theme_color = Column(String, default="#ff5722") # Orange from your sheet

    home = relationship("Home", back_populates="settings")