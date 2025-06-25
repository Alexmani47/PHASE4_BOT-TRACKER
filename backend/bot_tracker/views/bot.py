from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bot_tracker.models import db
from bot_tracker.models.bot import Bot
from bot_tracker.models.user import User

bot_bp = Blueprint('bot_bp', __name__, url_prefix='/bots')

def get_current_user():
    return User.query.get(get_jwt_identity())

@bot_bp.route('/', methods=['GET'])
@jwt_required()
def get_bots():
    user = get_current_user()
    bots = Bot.query.all() if user.is_admin else Bot.query.filter_by(user_name=user.user_name).all()
    return jsonify([b.to_dict() for b in bots]), 200

@bot_bp.route('/', methods=['POST'])
@jwt_required()
def create_bot():
    user = get_current_user()
    if not user.is_admin:
        return jsonify({"error": "Only admins can create bots"}), 403

    data = request.get_json()
    name = data.get('name')
    user_name = data.get('user_name') or user.user_name

    if not name:
        return jsonify({"error": "Bot name is required"}), 400

    # Optional: Validate user exists
    assigned_user = User.query.filter_by(user_name=user_name).first()
    if not assigned_user:
        return jsonify({"error": "Assigned user not found"}), 404

    bot = Bot(
        name=name,
        platform=data.get('platform'),
        strategy=data.get('strategy'),
        user_name=user_name
    )
    db.session.add(bot)
    db.session.commit()
    return jsonify(bot.to_dict()), 201


@bot_bp.route('/<int:bot_id>', methods=['PATCH'])
@jwt_required()
def update_bot(bot_id):
    user = get_current_user()
    bot = Bot.query.get(bot_id)
    if not bot:
        return jsonify({"error": "Bot not found"}), 404
    if not user.is_admin and bot.user_name != user.user_name:
        return jsonify({"error": "Access denied"}), 403

    data = request.get_json()
    bot.name = data.get('name', bot.name)
    bot.platform = data.get('platform', bot.platform)
    bot.strategy = data.get('strategy', bot.strategy)
    db.session.commit()
    return jsonify(bot.to_dict()), 200

@bot_bp.route('/<int:bot_id>', methods=['DELETE'])
@jwt_required()
def delete_bot(bot_id):
    user = get_current_user()
    bot = Bot.query.get(bot_id)
    if not bot:
        return jsonify({"error": "Bot not found"}), 404
    if not user.is_admin:
        return jsonify({"error": "Admin access required"}), 403
    db.session.delete(bot)
    db.session.commit()
    return jsonify({"message": "Bot deleted"}), 200