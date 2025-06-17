from flask import Blueprint, request, jsonify
from bot_tracker.models import db
from bot_tracker.models.bot import Bot

bot_bp = Blueprint('bot_bp', __name__)

@bot_bp.route('/', methods=['GET'])
def get_bots():
    bots = Bot.query.all()
    return jsonify([bot.to_dict() for bot in bots])

@bot_bp.route('/', methods=['POST'])
def create_bot():
    data = request.get_json()
    bot = Bot(
        name=data['name'],
        platform=data['platform'],
        status=data.get('status', 'inactive'),
        user_id=data['user_id']
    )
    db.session.add(bot)
    db.session.commit()
    return jsonify(bot.to_dict()), 201
