from flask import Blueprint, request, jsonify, current_app
from extensions import db
from models import UserProfile
from werkzeug.security import check_password_hash
import unicodedata
import traceback

# optional bcrypt fallback
try:
    import bcrypt
except Exception:
    bcrypt = None

auth_bp = Blueprint('auth', __name__)

def normalize_email(e: str) -> str:
    if not e:
        return ""
    return unicodedata.normalize("NFKC", e).strip().lower()

@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json(silent=True, force=True) or {}
    name = (data.get('name') or "").strip()
    email = normalize_email(data.get('email') or "")
    password = data.get('password')
    role = data.get('role', 'user')

    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required"}), 400

    existing = UserProfile.query.filter(UserProfile.email == email).first()
    if existing:
        return jsonify({"error": "A user with that email already exists"}), 409

    user = UserProfile(name=name, email=email)
    if hasattr(user, "set_password"):
        user.set_password(password)
    else:
        user.password_hash = password
    user.role = role
    db.session.add(user)
    db.session.commit()
    return jsonify({
        "message": "User registered successfully",
        "user_id": user.id,
        "email": user.email,
        "name": user.name
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json(silent=True, force=True) or {}
    raw_email = data.get('email') or ""
    password = data.get('password') or ""

    normalized = normalize_email(raw_email)

    current_app.logger.debug("Login attempt - raw email: %r", raw_email)
    current_app.logger.debug("Login attempt - normalized email: %r", normalized)

    if not normalized or not password:
        current_app.logger.warning("Missing email or password")
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Try exact normalized match
        user = UserProfile.query.filter(UserProfile.email == normalized).first()
        current_app.logger.debug("User found by exact normalized match: %s", bool(user))

        # Fallback to ilike
        if not user:
            try:
                user = UserProfile.query.filter(UserProfile.email.ilike(normalized)).first()
                current_app.logger.debug("User found by ilike fallback: %s", bool(user))
            except Exception as e:
                current_app.logger.exception("Exception during ilike search: %s", e)
                user = None

        if not user:
            current_app.logger.warning("Login failed - no user for email: %s", normalized)
            return jsonify({"error": "Invalid email or password"}), 401

        ph = getattr(user, "password_hash", None)
        current_app.logger.debug("Stored password_hash repr: %r", ph)

        if not ph:
            current_app.logger.warning("No password hash present for user: %s", normalized)
            return jsonify({"error": "Invalid email or password"}), 401

        # First try werkzeug's check (handles werkzeug-generated hashes)
        try:
            ok = check_password_hash(ph, password)
            current_app.logger.debug("Werkzeug check_password_hash result: %s for user id %s", ok, user.id)
            if ok:
                current_app.logger.info("Successful login (werkzeug) for user: %s (id=%s)", user.email, user.id)
                return jsonify({"message": "Login successful!", "user_id": user.id, "role": user.role}), 200
        except ValueError as ve:
            # invalid hash format for werkzeug, fall back to bcrypt if available
            current_app.logger.debug("werkzeug.check_password_hash ValueError: %s - falling back", ve)
        except Exception as e:
            current_app.logger.exception("Unexpected error in werkzeug.check_password_hash: %s", e)
            # continue to fallback below

        # Fallback: if bcrypt is installed and stored hash looks like a bcrypt hash ($2b$ or $2a$)
        if bcrypt is not None and isinstance(ph, (str, bytes)) and str(ph).startswith("$2"):
            try:
                # bcrypt requires bytes
                ph_bytes = ph if isinstance(ph, (bytes, bytearray)) else ph.encode('utf-8')
                pw_bytes = password.encode('utf-8')
                bcrypt_ok = bcrypt.checkpw(pw_bytes, ph_bytes)
                current_app.logger.debug("bcrypt.checkpw result: %s for user id %s", bcrypt_ok, user.id)
                if bcrypt_ok:
                    current_app.logger.info("Successful login (bcrypt fallback) for user: %s (id=%s)", user.email, user.id)
                    return jsonify({"message": "Login successful!", "user_id": user.id, "role": user.role}), 200
            except Exception as e:
                current_app.logger.exception("Error while checking bcrypt hash for user id %s: %s", user.id, e)
        else:
            current_app.logger.debug("bcrypt not available or hash not bcrypt: bcrypt=%s ph_type=%s", bcrypt is not None, type(ph))

        current_app.logger.warning("Invalid password for user: %s (id=%s)", user.email, user.id)
        return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        current_app.logger.exception("Unhandled exception in login flow: %s", e)
        current_app.logger.debug("Request payload: %r", data)
        current_app.logger.debug("Traceback: %s", traceback.format_exc())
        return jsonify({"error": "Authentication error"}), 500
