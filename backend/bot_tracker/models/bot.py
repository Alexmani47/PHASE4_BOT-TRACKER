from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from bot_tracker.extensions import db

class Bot(db.Model):  
    __tablename__ = 'bots'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    strategy = db.Column(db.String, nullable=True)
    platform = db.Column(db.String, nullable=True)

    user_name = db.Column(db.String, db.ForeignKey('users.user_name'), nullable=False)
    user = db.relationship("User", back_populates="bots", primaryjoin="Bot.user_name == User.user_name")

    trades = db.relationship("Trade", back_populates="bot", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "strategy": self.strategy,
            "platform": self.platform,
            "user_name": self.user_name,
        }
