from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message
from bot_tracker.models import db
from bot_tracker.models.user import User
from bot_tracker.extensions import mail

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    is_admin = data.get('is_admin', False)

    if not username or not password or not email:
        return jsonify({"error": "Username, email and password required"}), 400

    if User.query.filter_by(user_name=username).first():
        return jsonify({"error": "Username already exists"}), 409

    new_user = User(
        user_name=username,
        email=email,
        is_admin=is_admin,
        password=generate_password_hash(password)
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, username=user.user_name), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict(include_admin=True)), 200