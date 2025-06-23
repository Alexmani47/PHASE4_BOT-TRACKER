from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bot_tracker.models import db
from bot_tracker.models.bot import Bot
from bot_tracker.models.user import User

bot_bp = Blueprint('bot_bp', __name__, url_prefix='/bots')

def get_current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)

@bot_bp.route('/', methods=['GET'])
@jwt_required()
def get_bots():
    current_user = get_current_user()
    if current_user.is_admin:
        bots = Bot.query.all()
    else:
        bots = Bot.query.filter_by(user_id=current_user.id).all()

    return jsonify([bot.to_dict() for bot in bots]), 200

@bot_bp.route('/', methods=['POST'])
@jwt_required()
def create_bot():
    current_user = get_current_user()
    data = request.get_json()

    bot = Bot(
        name=data['name'],
        platform=data['platform'],
        status=data.get('status', 'inactive'),
        user_id=current_user.id,
        strategy_id=data.get('strategy_id')
    )
    db.session.add(bot)
    db.session.commit()
    return jsonify(bot.to_dict()), 201

@bot_bp.route('/<int:bot_id>', methods=['PATCH'])
@jwt_required()
def update_bot(bot_id):
    current_user = get_current_user()
    bot = Bot.query.get(bot_id)
    if not bot:
        return jsonify({'error': 'Bot not found'}), 404

    if not current_user.is_admin and bot.user_id != current_user.id:
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json()
    bot.name = data.get('name', bot.name)
    bot.strategy_id = data.get('strategy_id', bot.strategy_id)

    db.session.commit()
    return jsonify(bot.to_dict()), 200

@bot_bp.route('/<int:bot_id>', methods=['DELETE'])
@jwt_required()
def delete_bot(bot_id):
    current_user = get_current_user()
    bot = Bot.query.get(bot_id)
    if not bot:
        return jsonify({'error': 'Bot not found'}), 404

    if not current_user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    db.session.delete(bot)
    db.session.commit()
    return jsonify({'message': 'Bot deleted'}), 200
