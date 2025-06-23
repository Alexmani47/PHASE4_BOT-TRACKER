from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from bot_tracker.extensions import db 

class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False) 

    bots = relationship("Bot", back_populates="user", cascade="all, delete-orphan")
    strategies = relationship("Strategy", back_populates="user", cascade="all, delete-orphan")
    trades = relationship("Trade", back_populates="user")

    def to_dict(self, include_admin=False, include_related=False):
        data = {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }
        if include_admin:
            data["is_admin"] = self.is_admin

        if include_related:
            data["bots"] = [bot.to_dict() for bot in self.bots]
            data["strategies"] = [strategy.to_dict() for strategy in self.strategies]
            data["trades"] = [trade.to_dict() for trade in self.trades]

        return data
