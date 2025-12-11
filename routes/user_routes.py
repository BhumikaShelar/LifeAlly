from flask import Blueprint, jsonify, current_app
from extensions import db
from models import UserProfile
from routes.auth_utils import admin_required, login_required

user_bp = Blueprint('users', __name__)

# Delete user: require admin or the user themselves (for now require admin)
@user_bp.route('/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    """
    Server-side safeguard:
      - Do not allow deleting accounts with role == 'admin' (return 403).
      - This prevents accidental or malicious deletion of admin users.
    """
    user = UserProfile.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if getattr(user, "role", None) == "admin":
        current_app.logger.warning("Attempt to delete admin account via API: id=%s email=%s", user.id, user.email)
        return jsonify({"error": "Cannot delete admin accounts via API"}), 403

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User and all related queries/results deleted"}), 200
    except Exception as e:
        current_app.logger.exception("Error deleting user id=%s: %s", user_id, str(e))
        db.session.rollback()
        return jsonify({"error": "Delete failed"}), 500

