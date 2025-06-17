from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from bot_tracker.models import db  
from datetime import datetime

class Trade(db.Model):
    __tablename__ = 'trades'

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    asset = Column(String, nullable=False)
    profit_loss = Column(Float)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    bot_id = Column(Integer, ForeignKey('bots.id'), nullable=False)
    strategy_id = Column(Integer, ForeignKey('strategies.id'), nullable=True)

    user = relationship("User", back_populates="trades")
    bot = relationship("Bot", back_populates="trades")
    strategy = relationship("Strategy", back_populates="trades")

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.strftime('%-m/%-d/%Y') if self.date else None, 
            "asset": self.asset,
            "profit_loss": self.profit_loss,
            "user_id": self.user_id,
            "bot_id": self.bot_id,
            "strategy_id": self.strategy_id,
            "strategy": self.strategy.to_dict() if self.strategy else None
        }
