from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from bot_tracker.extensions import db

class Bot(db.Model):  
    __tablename__ = 'bots'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    strategy_id = db.Column(db.Integer, db.ForeignKey('strategies.id'), nullable=True)

    user = db.relationship("User", back_populates="bots")
    strategy = db.relationship("Strategy", back_populates="bots")
    trades = db.relationship("Trade", back_populates="bot", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "strategy_id": self.strategy_id,
        }
