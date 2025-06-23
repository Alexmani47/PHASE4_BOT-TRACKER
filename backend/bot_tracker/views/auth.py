from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message

from bot_tracker.models import db
from bot_tracker.models.user import User
from bot_tracker.extensions import mail

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/test-email', methods=['GET'])
def send_test_email():
    msg = Message("Hello from Bot Tracker!", recipients=["your-other-email@example.com"])
    msg.body = "This is a test email sent from Flask-Mail!"
    mail.send(msg)
    return {"message": "Email sent successfully"}, 200

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        is_admin = data.get('is_admin', False)

        print("Received username:", username)
        print("Received password:", password)

        if not username or not password or not email:
            return jsonify({"error": "Username, email and password required"}), 400

        existing_user = User.query.filter_by(username=username).first()
        print("User exists:", bool(existing_user))

        if existing_user:
            return jsonify({"error": "Username already exists"}), 409

        new_user = User(
            username=username,
            email=email,
            is_admin=is_admin
        )
        new_user.password = generate_password_hash(password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print("Error in register route:", e)
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True, silent=True)
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, username=user.username), 200  

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(logged_in_as=user.username), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin
    }), 200
