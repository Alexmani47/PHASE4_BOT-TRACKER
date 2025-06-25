from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from bot_tracker.models import db
from bot_tracker.models.user import User
from bot_tracker.models.bot import Bot
from bot_tracker.models.trade import Trade

user_bp = Blueprint('user_bp', __name__, url_prefix='/users')

def get_current_user():
    return User.query.get(get_jwt_identity())

@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    user = get_current_user()
    if not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    return jsonify([u.to_dict(include_admin=True) for u in User.query.all()]), 200

@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = get_current_user()
    if not user.is_admin and user.id != user_id:
        return jsonify({'error': 'Access denied'}), 403

    user_obj = User.query.get(user_id)
    if user_obj:
        return jsonify(user_obj.to_dict(include_admin=True, include_related=True)), 200
    return jsonify({'error': 'User not found'}), 404

@user_bp.route('/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    current = get_current_user()
    if not current.is_admin and current.id != user_id:
        return jsonify({'error': 'Access denied'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    user.user_name = data.get('user_name', user.user_name)
    user.email = data.get('email', user.email)
    if 'password' in data:
        user.password = generate_password_hash(data['password'])
    if current.is_admin:
        user.is_admin = data.get('is_admin', user.is_admin)

    db.session.commit()
    return jsonify(user.to_dict(include_admin=True)), 200

@user_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = get_current_user()
    if not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403

    user_to_delete = User.query.get(user_id)
    if not user_to_delete:
        return jsonify({'error': 'User not found'}), 404

    db.session.delete(user_to_delete)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200

@user_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    user = get_current_user()
    bots = Bot.query.filter_by(user_name=user.user_name).count()
    trades = Trade.query.filter_by(user_name=user.user_name).all()
    total_profit = round(sum(t.profit_loss or 0 for t in trades), 2)
    recent_trades = sorted(trades, key=lambda t: t.date, reverse=True)[:5]
    return jsonify({
        'bots_count': bots,
        'trades_count': len(trades),
        'total_profit': total_profit,
        'recent_trades': [t.to_dict() for t in recent_trades]
    }), 200
