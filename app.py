from flask import Flask
from flask_migrate import Migrate
from bot_tracker.models import db  

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bot_tracker.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    Migrate(app, db)

    from bot_tracker.models import user, bot, strategy, trade

    from bot_tracker.views.user import user_bp
    from bot_tracker.views.bot import bot_bp
    from bot_tracker.views.strategy import strategy_bp
    from bot_tracker.views.trade import trade_bp

    app.register_blueprint(user_bp, url_prefix='/users')
    app.register_blueprint(bot_bp, url_prefix='/bots')
    app.register_blueprint(strategy_bp, url_prefix='/strategies')
    app.register_blueprint(trade_bp, url_prefix='/trades')

    return app

app = create_app()
