from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .bot import Bot
from .strategy import Strategy
from .trade import Trade
