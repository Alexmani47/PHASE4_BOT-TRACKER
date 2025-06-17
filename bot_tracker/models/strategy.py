from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from bot_tracker.models import db 

class Strategy(db.Model):
    __tablename__ = 'strategies'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    user = relationship("User", back_populates="strategies")
    bots = relationship("Bot", back_populates="strategy")
    trades = relationship("Trade", back_populates="strategy")
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "user_id": self.user_id,
    }
