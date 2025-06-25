from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from bot_tracker.models import db
from bot_tracker.models.trade import Trade
from bot_tracker.models.user import User

trade_bp = Blueprint('trade_bp', __name__, url_prefix='/trades')

def get_current_user():
    return User.query.get(get_jwt_identity())

@trade_bp.route('/', methods=['GET'])
@jwt_required()
def get_trades():
    user = get_current_user()
    trades = Trade.query.all() if user.is_admin else Trade.query.filter_by(user_name=user.user_name).all()
    return jsonify([t.to_dict() for t in trades]), 200

@trade_bp.route('/', methods=['POST'])
@jwt_required()
def create_trade():
    user = get_current_user()
    data = request.get_json()

    try:
        date_obj = datetime.strptime(data['date'], "%m/%d/%Y").date()
        trade = Trade(
            date=date_obj,
            asset=data['asset'],
            profit_loss=data['profit_loss'],
            bot_name=data['bot_name'],
            user_name=user.user_name
        )
        db.session.add(trade)
        db.session.commit()
        return jsonify(trade.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@trade_bp.route('/<int:trade_id>', methods=['PATCH'])
@jwt_required()
def update_trade(trade_id):
    user = get_current_user()
    trade = Trade.query.get(trade_id)
    if not trade:
        return jsonify({"error": "Trade not found"}), 404
    if not user.is_admin and trade.user_name != user.user_name:
        return jsonify({"error": "Access denied"}), 403

    data = request.get_json()
    if 'date' in data:
        try:
            trade.date = datetime.strptime(data['date'], "%m/%d/%Y").date()
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400

    trade.asset = data.get('asset', trade.asset)
    trade.profit_loss = data.get('profit_loss', trade.profit_loss)
    trade.bot_name = data.get('bot_name', trade.bot_name)
    db.session.commit()
    return jsonify(trade.to_dict()), 200

@trade_bp.route('/<int:trade_id>', methods=['DELETE'])
@jwt_required()
def delete_trade(trade_id):
    user = get_current_user()
    trade = Trade.query.get(trade_id)
    if not trade:
        return jsonify({'error': 'Trade not found'}), 404
    if not user.is_admin and trade.user_name != user.user_name:
        return jsonify({'error': 'Access denied'}), 403

    db.session.delete(trade)
    db.session.commit()
    return jsonify({'message': 'Trade deleted'}), 200