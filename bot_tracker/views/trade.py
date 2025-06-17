from flask import Blueprint, request, jsonify
from datetime import datetime
from bot_tracker.models import db
from bot_tracker.models.trade import Trade

trade_bp = Blueprint('trade_bp', __name__)

@trade_bp.route('/', methods=['GET'])
def get_trades():
    trades = Trade.query.all()
    return jsonify([t.to_dict() for t in trades])

@trade_bp.route('/', methods=['POST'])
def create_trade():
    data = request.get_json()

    try:
        date_obj = datetime.strptime(data['date'], "%m/%d/%Y").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use MM/DD/YYYY."}), 400

    trade = Trade(
        date=date_obj,
        asset=data['asset'],
        profit_loss=data['profit_loss'],
        bot_id=data['bot_id'],
        user_id=data['user_id'],
        strategy_id=data.get('strategy_id') 
    )

    db.session.add(trade)
    db.session.commit()
    return jsonify(trade.to_dict()), 201
