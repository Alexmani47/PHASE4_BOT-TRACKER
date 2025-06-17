

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from bot_tracker.models import db 

class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    bots = relationship("Bot", back_populates="user")
    strategies = relationship("Strategy", back_populates="user")
    trades = relationship("Trade", back_populates="user")
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }