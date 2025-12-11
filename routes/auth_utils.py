from functools import wraps
from flask import request, jsonify
from models import UserProfile

def get_user_from_request():
    # For simplicity, get user_id from headers (or JWT/cookie in production)
    user_id = request.headers.get('User-Id')
    if not user_id:
        return None
    user = UserProfile.query.get(user_id)
    return user

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_user_from_request()
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_user_from_request()
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function