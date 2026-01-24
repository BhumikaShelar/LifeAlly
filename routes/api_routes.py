from flask import Blueprint, request, jsonify
from extensions import db
from models import UserProfile, UserQuery, PredictionResult, UserProfileMemory
import traceback

api_bp = Blueprint('api', __name__)

try:
    from ai_pipeline import run_pipeline
except Exception as e:
    def run_pipeline(*args, **kwargs):
        raise RuntimeError(
            "ai_pipeline.run_pipeline is not available. "
            "Either implement run_pipeline(query_text, domain, user_id=None, query_id=None, profile=None) "
            "in ai_pipeline.py or ensure ai_pipeline can be imported without side effects."
        )

@api_bp.route('/predict', methods=['POST'])
def predict():
    payload = request.get_json(force=True, silent=True)
    if not payload:
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    domain = payload.get("domain")
    text = payload.get("text")
    user_id = payload.get("user_id")

    if not domain or not text:
        return jsonify({"error": "Both 'domain' and 'text' are required fields"}), 400

    # If user_id provided, ensure user exists
    if user_id is not None:
        user = UserProfile.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found for provided user_id"}), 404

    # Load user session/profile memory (if any)
    profile = None
    if user_id is not None:
        mem = UserProfileMemory.query.filter_by(user_id=user_id, domain=domain).first()
        if mem and mem.profile_json:
            profile = dict(mem.profile_json)
        else:
            profile = {}

    # Persist the query
    try:
        db_user_id = user_id if user_id is not None else 0
        uq = UserQuery(user_id=db_user_id, domain=domain, query_text=text)
        db.session.add(uq)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to persist query", "detail": str(e)}), 500

    # Run AI pipeline (now with profile memory)
    try:
        pipeline_out = run_pipeline(query_text=text, domain=domain, user_id=user_id, query_id=uq.id, profile=profile)
    except RuntimeError as re:
        return jsonify({"error": str(re)}), 500
    except Exception as e:
        tb = traceback.format_exc()
        return jsonify({"error": "Pipeline execution failed", "detail": str(e), "trace": tb}), 500

    if not isinstance(pipeline_out, dict):
        return jsonify({"error": "ai_pipeline.run_pipeline must return a dict"}), 500

    result_text = pipeline_out.get("result_text") or pipeline_out.get("advice") or ""
    raw_output = pipeline_out.get("raw_output") or pipeline_out.get("raw") or None
    model_version = pipeline_out.get("model_version")
    confidence = pipeline_out.get("confidence")
    updated_profile = pipeline_out.get("updated_profile", None)

    # Save updated profile back to DB
    if user_id is not None and updated_profile is not None:
        mem = UserProfileMemory.query.filter_by(user_id=user_id, domain=domain).first()
        if not mem:
            mem = UserProfileMemory(user_id=user_id, domain=domain, profile_json=updated_profile)
            db.session.add(mem)
        else:
            mem.profile_json = updated_profile
        db.session.commit()

    # Persist prediction result
    try:
        pr = PredictionResult(
            query_id=uq.id,
            result_text=result_text
        )
        db.session.add(pr)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to persist prediction result", "detail": str(e)}), 500

    return jsonify({
        "query_id": uq.id,
        "prediction_id": pr.id,
        "result_text": result_text,
        "model_version": model_version,
        "confidence": confidence,
        "profile_memory": updated_profile
    }), 201
