from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bot_tracker.models import db
from bot_tracker.models.strategy import Strategy
from bot_tracker.models.user import User

strategy_bp = Blueprint('strategy_bp', __name__, url_prefix='/strategies')


def get_current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)

@strategy_bp.route('/', methods=['GET'])
@jwt_required()
def get_strategies():
    current_user = get_current_user()
    if current_user.is_admin:
        strategies = Strategy.query.all()
    else:
        strategies = Strategy.query.filter_by(user_id=current_user.id).all()
    return jsonify([s.to_dict() for s in strategies]), 200

@strategy_bp.route('/', methods=['POST'])
@jwt_required()
def create_strategy():
    current_user = get_current_user()
    data = request.get_json()

    strategy = Strategy(
        name=data['name'],
        description=data.get('description', ''),
        user_id=current_user.id
    )
    db.session.add(strategy)
    db.session.commit()
    return jsonify(strategy.to_dict()), 201

@strategy_bp.route('/<int:strategy_id>', methods=['PATCH'])
@jwt_required()
def update_strategy(strategy_id):
    current_user = get_current_user()
    strategy = Strategy.query.get(strategy_id)
    if not strategy:
        return jsonify({'error': 'Strategy not found'}), 404

    if not current_user.is_admin and strategy.user_id != current_user.id:
        return jsonify({'error': 'Access denied'}), 403

    data = request.get_json()
    strategy.name = data.get('name', strategy.name)
    strategy.description = data.get('description', strategy.description)

    db.session.commit()
    return jsonify(strategy.to_dict()), 200

@strategy_bp.route('/<int:strategy_id>', methods=['DELETE'])
@jwt_required()
def delete_strategy(strategy_id):
    current_user = get_current_user()
    strategy = Strategy.query.get(strategy_id)
    if not strategy:
        return jsonify({'error': 'Strategy not found'}), 404

    if not current_user.is_admin and strategy.user_id != current_user.id:
        return jsonify({'error': 'Access denied'}), 403

    db.session.delete(strategy)
    db.session.commit()
    return jsonify({'message': 'Strategy deleted'}), 200
