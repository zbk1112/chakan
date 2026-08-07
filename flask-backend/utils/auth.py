from flask_jwt_extended import create_access_token, verify_jwt_in_request, get_jwt_identity
from flask import jsonify
import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def generate_token(user_id, role):
    return create_access_token(identity={'id': user_id, 'role': role})

def require_admin(f):
    def decorated_function(*args, **kwargs):
        verify_jwt_in_request()
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return jsonify({'error': '权限不足'}), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def require_auth(f):
    def decorated_function(*args, **kwargs):
        verify_jwt_in_request()
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function
