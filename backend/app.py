from flask import Flask
from bot_tracker.extensions import db, migrate, jwt, mail
from datetime import timedelta
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://bottracker_db_user:Rl3RLFQMFILXDvrwkxL1Oul6gtjCuR4t@dpg-d1ej6rqli9vc73a4rc50-a.oregon-postgres.render.com/bottracker_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = ''
    app.config['MAIL_PASSWORD'] = ''
    app.config['MAIL_DEFAULT_SENDER'] = ''

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    CORS(app, origins=["https://fanciful-bavarois-464bf1.netlify.app/"], supports_credentials=True)

    from bot_tracker.views.user import user_bp
    from bot_tracker.views.bot import bot_bp
    from bot_tracker.views.trade import trade_bp
    from bot_tracker.views.auth import auth_bp

    app.register_blueprint(user_bp, url_prefix='/users')
    app.register_blueprint(bot_bp, url_prefix='/bots')
    app.register_blueprint(trade_bp, url_prefix='/trades')
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app

app = create_app()
