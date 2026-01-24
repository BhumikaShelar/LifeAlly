import os
from dotenv import load_dotenv
import joblib
import pandas as pd
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY must be set in your .env file!")

GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-pro")
llm = ChatGoogleGenerativeAI(
    model=GEMINI_MODEL_NAME,
    google_api_key=GEMINI_API_KEY,
    temperature=0.3
)

MODEL_PATHS = {
    "career_admission": "models/career_admission_model.pkl",
    "career_growth": "models/career_growth_model.pkl",
    "career_profession": "models/career_profession_model.pkl",
    "finance_disposable_income": "models/finance_disposable_income_model.pkl",
    "finance_loan": "models/finance_loan_model.pkl",
    "finance_personal_tracker": "models/finance_personal_tracker_model.pkl",
    "health_mental": "models/mental_health_model.pkl",
    "health_heart": "models/heart_health_xgb_model.pkl",
    "relationship_emotion": "models/relationship_emotion_model.pkl",
    "relationship": "models/relationship_model.pkl",
    "relationship_knn": "models/relationship_tfidf_knn.pkl",
}
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load models and their feature names dynamically
MODELS = {}
MODEL_FEATURES = {}
for key, rel_path in MODEL_PATHS.items():
    abs_path = os.path.join(BASE_DIR, rel_path)
    if not os.path.exists(abs_path):
        raise FileNotFoundError(f"Model file not found: {abs_path}")
    model = joblib.load(abs_path)
    MODELS[key] = model
    feature_names = getattr(model, "feature_names_in_", None)
    if feature_names is not None:
        MODEL_FEATURES[key] = list(feature_names)
    else:
        MODEL_FEATURES[key] = None

DOMAIN_MODELS = {
    "career": ["career_admission", "career_growth", "career_profession"],
    "finance": ["finance_disposable_income", "finance_loan", "finance_personal_tracker"],
    "health": ["health_mental", "health_heart"],
    "relationship": ["relationship_emotion", "relationship", "relationship_knn"],
}

def extract_structured_features(user_query: str, feature_names: list, existing_profile=None):
    # Optionally use existing profile as context
    profile_context = ""
    if existing_profile:
        profile_items = [f"{k}: {v}" for k, v in existing_profile.items()]
        profile_context = f"Known profile so far:\n" + "\n".join(profile_items) + "\n"
    prompt = (
        f"You are an expert AI assistant. {profile_context}"
        f"Extract the following details from the user's message and output a comma-separated list in this exact order (no labels, just values):\n"
        f"{', '.join(feature_names)}\n\n"
        f"User message:\n{user_query}\n\n"
        f"If a value is missing or unclear, output a question mark (?) for that value. Use no extra text."
    )
    extract = llm.invoke([HumanMessage(content=prompt)]).content.strip()
    features = [x.strip() for x in extract.split(",")]
    if len(features) == len(feature_names):
        return features
    return None

def is_structured_input(user_query: str, feature_names: list):
    features = [x.strip() for x in user_query.split(",")]
    return len(features) == len(feature_names)

def get_model_features(user_query: str, feature_names: list, profile=None):
    if feature_names:
        # If profile exists and is fully populated, use it
        if profile and all(k in profile and profile[k] not in [None, "?", ""] for k in feature_names):
            return [profile[k] for k in feature_names]
        # If user input is a structured list, use it
        if is_structured_input(user_query, feature_names):
            return [x.strip() for x in user_query.split(",")]
        # Otherwise, extract using LLM, using profile context if given
        return extract_structured_features(user_query, feature_names, profile)
    else:
        return [user_query]  # e.g., for text models

def update_profile_with_features(profile, feature_names, feature_values):
    """Update (or create) profile dict with extracted feature values."""
    if not profile:
        profile = {}
    for k, v in zip(feature_names, feature_values):
        # Only overwrite if not "?" or empty
        if v and v != "?":
            profile[k] = v
    return profile

def run_pipeline(query_text, domain, user_id=None, query_id=None, profile=None):
    if domain not in DOMAIN_MODELS:
        return {"result_text": f"Invalid domain: {domain}", "raw_output": {}, "model_version": GEMINI_MODEL_NAME}

    model_outputs = {}
    prediction_success = {}
    updated_profile = profile.copy() if profile else {}
    for model_key in DOMAIN_MODELS[domain]:
        try:
            model = MODELS[model_key]
            feature_names = MODEL_FEATURES[model_key]
            features = get_model_features(query_text, feature_names, profile)
            if feature_names:
                X = pd.DataFrame([features], columns=feature_names)
                prediction = model.predict(X)[0]
                # Update profile with any new info
                updated_profile = update_profile_with_features(updated_profile, feature_names, features)
            else:
                prediction = model.predict([features])[0]
            model_outputs[model_key] = prediction
            prediction_success[model_key] = True
        except Exception as e:
            model_outputs[model_key] = None
            prediction_success[model_key] = False

    # Prepare a filtered, user-friendly summary for Gemini
    filtered_outputs = {}
    for k, v in model_outputs.items():
        if v is not None:
            filtered_outputs[k] = v

    failed_models = [k for k, v in prediction_success.items() if not v]

    # Compose a user-friendly summary for Gemini prompt
    summary_lines = []
    if filtered_outputs:
        for k, v in filtered_outputs.items():
            summary_lines.append(f"{k.replace('_', ' ').title()}: {v}")
    if failed_models:
        summary_lines.append("\n⚠️ Some specialized models could not provide personalized insights due to missing or incomplete information. For best results, try providing more details or answering all the requested questions!")

    summary = "\n".join(summary_lines) if summary_lines else "No model-based insights could be generated from the information provided."

    prompt = f"""You are a supportive, friendly AI life coach.
Always use relevant, positive, and engaging emojis to make the advice more interactive and approachable.
User query: {query_text}
Domain: {domain}
Model insights:
{summary}

Summarize results and provide actionable, encouraging advice in a conversational, upbeat tone. Use emojis for each step or section! If some insights are missing, gently encourage the user to provide more details for even more personalized advice.
"""
    try:
        advice = llm.invoke([HumanMessage(content=prompt)]).content.strip()
    except Exception as e:
        advice = "Sorry, there was an error with the LLM. Please try again later."

    return {
        "result_text": advice,
        "raw_output": model_outputs,
        "model_version": GEMINI_MODEL_NAME,
        "model_prediction_success": prediction_success,
        "updated_profile": updated_profile
    }

if __name__ == "__main__":
    import argparse, json
    parser = argparse.ArgumentParser(description="Run AI pipeline from terminal.")
    parser.add_argument('--domain', required=True, choices=['career', 'finance', 'health', 'relationship'])
    parser.add_argument('--text', required=True, help='User input/query text')
    parser.add_argument('--user_id', type=int, default=None)
    args = parser.parse_args()
    # For CLI, you could load profile JSON here if desired
    out = run_pipeline(args.text, args.domain, user_id=args.user_id)
    print(json.dumps(out, indent=2, ensure_ascii=False))