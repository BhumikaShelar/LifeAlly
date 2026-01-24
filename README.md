# LifeAlly AI Life Coach

A comprehensive AI Life Coach application featuring a Flask backend, a React user interface, and a Vite-based admin dashboard.

## Project Structure

- `app.py`: Main Flask application entry point.
- `ai_pipeline.py`: AI logic and model integration using Google Gemini.
- `user-ui/`: React frontend for regular users.
- `admin-ui/`: React + Vite frontend for administrators.
- `models/`: Pre-trained machine learning models (stored via Git LFS).
- `routes/`: Backend API route definitions.
- `data/`: Dataset files for the models.

## Setup

1. **Backend**:
   - Create a virtual environment: `python -m venv venv`
   - Install dependencies: `pip install -r requirements.txt`
   - Copy `.env.example` to `.env` and add your API keys.
   - Run the app: `python app.py`

2. **User UI**:
   - `cd user-ui`
   - `npm install`
   - `npm start`

3. **Admin UI**:
   - `cd admin-ui/LIFEALLY`
   - `npm install`
   - `npm run dev`

## Features

- AI-powered life coaching (Career, Finance, Health, Relationships).
- Secure authentication system.
- Comprehensive user profiling.
- Admin dashboard for monitoring and management.
