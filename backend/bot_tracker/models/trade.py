from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from bot_tracker.extensions import db
from datetime import datetime

class Trade(db.Model):
    __tablename__ = 'trades'

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    asset = Column(String, nullable=False)
    profit_loss = Column(Float)

    user_name = Column(String, ForeignKey('users.user_name'), nullable=False)
    bot_name = Column(String, ForeignKey('bots.name'), nullable=False)

    user = relationship("User", back_populates="trades", primaryjoin="Trade.user_name == User.user_name")
    bot = relationship("Bot", back_populates="trades", primaryjoin="Trade.bot_name == Bot.name")

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.strftime('%-m/%-d/%Y') if self.date else None,
            "asset": self.asset,
            "profit_loss": self.profit_loss,
            "user_name": self.user_name,
            "bot_name": self.bot_name,
        }
