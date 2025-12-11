from flask import Blueprint, jsonify, request, current_app
from extensions import db
from models import UserProfile, UserQuery, PredictionResult
from routes.auth_utils import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@admin_required
def list_users():
    # Add pagination & total
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 50))
    q = UserProfile.query.order_by(UserProfile.created_at.desc())
    pagination = q.paginate(page=page, per_page=per_page, error_out=False)
    users = pagination.items
    users_data = [
        {
            'id': u.id, 'name': u.name, 'email': u.email, 'role': u.role,
            'is_active': getattr(u, 'is_active', True),
            'created_at': u.created_at.isoformat() if u.created_at is not None else None
        } for u in users
    ]
    return jsonify({
        "items": users_data,
        "total": pagination.total,
        "page": page,
        "per_page": per_page
    }), 200

@admin_bp.route('/user/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user_admin(user_id):
    """
    Prevent deleting admin accounts via API.
    If the target user is an admin, return 403 and do not delete.
    """
    user = UserProfile.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if getattr(user, "role", None) == "admin":
        current_app.logger.warning("Attempt to delete admin account via admin API: id=%s email=%s", user.id, user.email)
        return jsonify({"error": "Cannot delete admin accounts via API"}), 403

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted"}), 200
    except Exception as e:
        current_app.logger.exception("Error deleting user id=%s: %s", user_id, str(e))
        db.session.rollback()
        return jsonify({"error": "Delete failed"}), 500

@admin_bp.route('/queries', methods=['GET'])
@admin_required
def list_queries():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 50))
    status = request.args.get('status')  # optional
    domain = request.args.get('domain')
    user_id = request.args.get('user_id')

    q = UserQuery.query
    if status:
        # status not stored in UserQuery; if you store status in PredictionResult, join instead
        pass
    if domain:
        q = q.filter_by(domain=domain)
    if user_id:
        q = q.filter_by(user_id=user_id)
    q = q.order_by(UserQuery.created_at.desc())

    pagination = q.paginate(page=page, per_page=per_page, error_out=False)
    items = []
    for uq in pagination.items:
        items.append({
            "id": uq.id,
            "user_id": uq.user_id,
            "user_email": uq.user.email if uq.user else None,
            "domain": uq.domain,
            "query_text": uq.query_text,
            "created_at": uq.created_at.isoformat(),
            # include latest result summary
            "latest_result": uq.results[-1].result_text[:200] if uq.results else None
        })

    return jsonify({
        "items": items,
        "total": pagination.total,
        "page": page,
        "per_page": per_page
    }), 200