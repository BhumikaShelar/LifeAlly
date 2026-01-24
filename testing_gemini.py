import os
from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
for m in genai.list_models():
    print(m.name, m.supported_generation_methods)