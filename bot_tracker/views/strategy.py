from flask import Blueprint, request, jsonify
from bot_tracker.models import db
from bot_tracker.models.strategy import Strategy

strategy_bp = Blueprint('strategy_bp', __name__)

@strategy_bp.route('/', methods=['GET'])
def get_strategies():
    strategies = Strategy.query.all()
    return jsonify([s.to_dict() for s in strategies])

@strategy_bp.route('/', methods=['POST'])
def create_strategy():
    data = request.get_json()
    strategy = Strategy(
        name=data['name'],
        description=data.get('description', ''),
        user_id=data['user_id']
    )
    db.session.add(strategy)
    db.session.commit()
    return jsonify(strategy.to_dict()), 201
