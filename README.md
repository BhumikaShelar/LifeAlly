# 🌟 LifeAlly — AI Life Coach Platform

> **An intelligent, full-stack life coaching platform** powered by **11 domain-specific ML models** and **Google Gemini 2.5 Pro**, delivering personalized guidance across **Career, Finance, Health, and Relationships**.

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Live Architecture](#live-architecture)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Technology Stack](#technology-stack)
6. [AI Pipeline — How It Works](#ai-pipeline--how-it-works)
7. [ML Models Overview](#ml-models-overview)
8. [Database Schema](#database-schema)
9. [API Endpoints](#api-endpoints)
10. [User Interface — User App](#user-interface--user-app)
11. [User Interface — Admin Dashboard](#user-interface--admin-dashboard)
12. [Getting Started](#getting-started)
13. [Environment Variables](#environment-variables)
14. [Security Design](#security-design)
15. [Notebooks & Model Training](#notebooks--model-training)
16. [Use Cases](#use-cases)
17. [License](#license)

---

## Overview

**LifeAlly** is a full-stack AI-powered life coaching platform that combines traditional Machine Learning with state-of-the-art Large Language Models (LLMs). A user simply types a message in natural language, and LifeAlly:

1. **Classifies** the query to the appropriate domain (Career, Finance, Health, Relationship).
2. **Extracts** structured numerical features from the free-text using Google Gemini.
3. **Runs** domain-specific pre-trained ML models to generate quantitative predictions.
4. **Synthesizes** an empathetic, emoji-rich, actionable coaching response using Gemini.
5. **Remembers** the user's profile per domain, enabling personalized follow-ups over time.

The platform is split into three separately running components:

| Component | Technology | Port |
| :--- | :--- | :--- |
| Backend API | Python + Flask | `5000` |
| User Chat App | React.js | `3000` |
| Admin Dashboard | Vite + React + TypeScript | `5173` |

---

## Live Architecture

```
┌──────────────────────┐      ┌──────────────────────┐
│   User React App     │      │  Admin Vite/TS App   │
│  (localhost:3000)    │      │  (localhost:5173)    │
└────────┬─────────────┘      └────────┬─────────────┘
         │ Axios HTTP                   │ Axios HTTP
         ▼                             ▼
┌─────────────────────────────────────────────────────┐
│              Flask REST API  (localhost:5000)        │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐   │
│  │ /api/auth│  │/api/pred-│  │  /api/admin/*   │   │
│  │ /register│  │  ict     │  │  users/queries  │   │
│  │ /login   │  └────┬─────┘  └────────-────────┘   │
│  └──────────┘       │                               │
└─────────────────────┼───────────────────────────────┘
                      │
         ┌────────────▼─────────────────┐
         │         AI Pipeline          │
         │  ┌───────────────────────┐   │
         │  │  Google Gemini 2.5Pro │   │  ← Feature Extraction
         │  │  (Feature Extractor)  │   │     + Advice Writer
         │  └───────────┬───────────┘   │
         │              │               │
         │  ┌───────────▼───────────┐   │
         │  │  11 ML Models (PKL)   │   │  ← Sklearn + XGBoost
         │  │  Career / Finance /   │   │
         │  │  Health / Relations   │   │
         │  └───────────────────────┘   │
         └──────────────────────────────┘
                      │
         ┌────────────▼────────────┐
         │   PostgreSQL Database   │
         │  user_profiles          │
         │  user_profile_memories  │
         │  user_queries           │
         │  prediction_results     │
         └─────────────────────────┘
```

---

## Features

### 👤 User Features
- ✅ **Register** a new account with name, email, and password.
- ✅ **Login** with secure password verification (Werkzeug pbkdf2 + Bcrypt fallback).
- ✅ **Select AI Domain** — Career, Finance, Health, or Relationship.
- ✅ **Chat with the AI Coach** using free-form natural language.
- ✅ **View Chat History** — review past messages and AI responses.
- ✅ **Persistent Profile Memory** — the AI remembers your profile details per domain across sessions.
- ✅ **Animated, modern UI** with Framer Motion transitions.

### 🛡️ Admin Features
- ✅ **Secure Admin Login** (role-checked on every request).
- ✅ **View All Users** — paginated list with registration date, role, and active status.
- ✅ **View User Detail** — drill into any individual user's information.
- ✅ **Delete Users** — remove non-admin accounts (admin deletion is server-side blocked).
- ✅ **View All Queries** — browse and filter every user query by domain or user.
- ✅ **Query Detail Modal** — view the full query text and latest AI response.
- ✅ **Domain Analytics Chart** — visualize query distribution per coaching domain.
- ✅ **Admin Task Manager** — track admin actions with an internal to-do component.
- ✅ **Profile & Settings Pages** for the logged-in admin account.

---

## Project Structure

```
LifeAlly/
│
├── app.py                          # Flask application factory & entry point
├── ai_pipeline.py                  # Core AI pipeline (Gemini + ML models)
├── config.py                       # Flask & DB configuration via .env
├── extensions.py                   # SQLAlchemy instance (db)
├── models.py                       # SQLAlchemy ORM models
├── migrate.py                      # Database migration helper
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment variable template
├── .gitignore
├── LICENSE                         # MIT License
│
├── routes/                         # Flask Blueprints
│   ├── auth_routes.py              # POST /api/auth/register, /login
│   ├── api_routes.py               # POST /api/predict
│   ├── admin_routes.py             # GET/DELETE /api/admin/users, /queries
│   ├── user_routes.py              # DELETE /api/users/:id
│   └── auth_utils.py              # @admin_required, @login_required decorators
│
├── models/                         # Pre-trained ML model files (.pkl)
│   ├── career_admission_model.pkl
│   ├── career_growth_model.pkl
│   ├── career_profession_model.pkl
│   ├── finance_disposable_income_model.pkl
│   ├── finance_loan_model.pkl
│   ├── finance_personal_tracker_model.pkl
│   ├── mental_health_model.pkl
│   ├── heart_health_xgb_model.pkl
│   ├── relationship_emotion_model.pkl
│   ├── relationship_model.pkl
│   └── relationship_tfidf_knn.pkl
│
├── data/                           # Training datasets (organized by domain)
│   ├── career/
│   ├── finance/
│   ├── health/
│   └── relationships/
│
├── notebooks/                      # Jupyter notebooks for model training
│   ├── career_models.ipynb
│   ├── finance_models.ipynb
│   ├── health_models.ipynb
│   ├── relationship_models.ipynb
│   └── lifeally_langgraph_pipeline.ipynb
│
├── migrations/                     # Alembic database migrations
│   └── versions/
│       └── 278fb1cbca1c_add_role_field_to_user_profiles.py
│
├── user-ui/                        # React.js User Chat Application
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DomainSelectorPage.jsx
│       │   └── ChatPage.jsx
│       ├── components/
│       ├── services/
│       └── styles/
│
└── admin-ui/
    └── LIFEALLY/                   # Vite + React + TypeScript Admin Dashboard
        ├── package.json
        ├── vite.config.ts
        ├── tsconfig.json
        └── src/
            ├── App.tsx
            ├── api/
            │   ├── client.ts       # Axios instance with interceptors
            │   ├── auth.ts
            │   └── admin.ts
            ├── components/
            │   ├── Sidebar.tsx
            │   ├── Topbar.tsx
            │   ├── DomainChart.tsx
            │   ├── AdminTodo.tsx
            │   ├── QueryDetailModal.tsx
            │   └── UserDetailModal.tsx
            └── pages/
                ├── Login.tsx
                ├── Dashboard.tsx
                ├── Users.tsx
                ├── UserView.tsx
                ├── Queries.tsx
                ├── Profile.tsx
                └── Settings.tsx
```

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | Python 3.x + Flask 2.3 | REST API framework |
| **ORM** | Flask-SQLAlchemy 3.0 | Database interaction layer |
| **Migrations** | Alembic (Flask-Migrate 4.0) | Database schema versioning |
| **Database** | PostgreSQL (via psycopg3) | Persistent relational storage |
| **Auth** | Werkzeug pbkdf2:sha256 + Bcrypt fallback | Secure password hashing |
| **CORS** | Flask-CORS | Cross-origin request handling |
| **AI — LLM** | Google Gemini 2.5 Pro (via LangChain) | Feature extraction + advice synthesis |
| **AI — ML** | Scikit-Learn + XGBoost | Domain-specific numerical predictions |
| **AI Framework** | LangChain + langchain-google-genai | LLM orchestration |
| **User Frontend** | React 19 + Framer Motion + Axios | Animated user chat interface |
| **Admin Frontend** | Vite + React 18 + TypeScript | Admin analytics dashboard |
| **Charts** | Chart.js + react-chartjs-2 | Domain usage analytics |
| **Data Queries** | TanStack React Query | Server-state management (Admin UI) |
| **UI Kit (Admin)** | Bootstrap 5 + React-Bootstrap | Admin component styling |
| **Icons** | React Icons | UI icons across admin app |

---

## AI Pipeline — How It Works

The core logic lives in `ai_pipeline.py`. Here is the step-by-step flow for each user query:

```
User Query (free text)
        │
        ▼
1. DOMAIN ROUTING (determined by frontend)
   "career" | "finance" | "health" | "relationship"
        │
        ▼
2. PROFILE MEMORY LOAD
   Load existing UserProfileMemory from DB for (user_id, domain)
        │
        ▼
3. FEATURE EXTRACTION (Google Gemini 2.5 Pro)
   Gemini reads the user's message + existing profile context
   → Outputs a comma-separated list of structured feature values
   → Missing values are represented as "?"
        │
        ▼
4. ML MODEL PREDICTIONS (per domain, all models run in parallel)
   ┌──────────────────────────────────────────────────────┐
   │  For each model in DOMAIN_MODELS[domain]:            │
   │  • Build a DataFrame with extracted feature values   │
   │  • Run model.predict(X)                              │
   │  • Store output in model_outputs dict                │
   └──────────────────────────────────────────────────────┘
        │
        ▼
5. PROFILE UPDATE
   Merge newly extracted feature values into the user's profile memory
   → Save updated profile_json back to DB (UserProfileMemory)
        │
        ▼
6. ADVICE SYNTHESIS (Google Gemini 2.5 Pro)
   Gemini receives:
   • Original user query
   • Domain name
   • Summary of ML model outputs
   → Generates emoji-rich, empathetic, actionable coaching advice
        │
        ▼
7. RESULT PERSISTENCE
   Save UserQuery + PredictionResult to DB
        │
        ▼
8. RESPONSE to frontend
   { result_text, model_version, raw_output, profile_memory }
```

### Memory System
Each user has a `user_profile_memories` row per domain. Over multiple conversations, the AI accumulates a richer understanding of the user (e.g., their income, stress level, career stage) — enabling increasingly personalized advice without asking the same questions twice.

---

## ML Models Overview

| Domain | Model Key | Algorithm | What It Predicts |
| :--- | :--- | :--- | :--- |
| **Career** | `career_admission` | Scikit-Learn | Admission probability |
| **Career** | `career_growth` | Scikit-Learn | Career growth trajectory |
| **Career** | `career_profession` | Scikit-Learn | Best-fit profession/role |
| **Finance** | `finance_disposable_income` | Scikit-Learn | Disposable income estimate |
| **Finance** | `finance_loan` | Scikit-Learn | Loan approval risk |
| **Finance** | `finance_personal_tracker` | Scikit-Learn | Spending pattern classification |
| **Health** | `health_mental` | Scikit-Learn | Mental wellness score |
| **Health** | `health_heart` | XGBoost | Cardiac risk level |
| **Relationship** | `relationship_emotion` | Scikit-Learn | Detected emotion type |
| **Relationship** | `relationship` | Scikit-Learn | Relationship compatibility score |
| **Relationship** | `relationship_knn` | TF-IDF + KNN | Semantic similarity matching |

> All models are serialized as `.pkl` files via `joblib` and stored in the `models/` directory. Models are loaded once at application startup for performance.

---

## Database Schema

### `user_profiles`
| Attribute | Data Type | Constraint |
| :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto-increment |
| `name` | Varchar(100) | Not Null |
| `email` | Varchar(120) | Unique, Not Null |
| `password_hash` | Varchar(255) | Not Null |
| `role` | Varchar(10) | Default: `'user'` |
| `is_active` | Boolean | Default: `true` |
| `created_at` | DateTime | Default: `now()` |

### `user_profile_memories`
| Attribute | Data Type | Constraint |
| :--- | :--- | :--- |
| `id` | Integer | Primary Key |
| `user_id` | Integer | FK → `user_profiles.id` (CASCADE) |
| `domain` | Varchar(100) | Not Null |
| `profile_json` | JSONB | Not Null, Default: `{}` |
| `updated_at` | DateTime | Default: `now()`, Auto-update |

> Unique constraint on `(user_id, domain)` — one memory slot per user per coaching domain.

### `user_queries`
| Attribute | Data Type | Constraint |
| :--- | :--- | :--- |
| `id` | Integer | Primary Key |
| `user_id` | Integer | FK → `user_profiles.id` (CASCADE) |
| `domain` | Varchar(100) | Not Null |
| `query_text` | Text | Not Null |
| `created_at` | DateTime | Default: `now()` |

### `prediction_results`
| Attribute | Data Type | Constraint |
| :--- | :--- | :--- |
| `id` | Integer | Primary Key |
| `query_id` | Integer | FK → `user_queries.id` (CASCADE) |
| `result_text` | Text | Not Null |
| `created_at` | DateTime | Default: `now()` |

### `admin_tasks`
| Attribute | Data Type | Constraint |
| :--- | :--- | :--- |
| `id` | Integer | Primary Key |
| `admin_id` | Integer | FK → `user_profiles.id` |
| `action` | Varchar(100) | Not Null |
| `target_id` | Integer | Nullable |
| `details` | Text | Nullable |
| `created_at` | DateTime | Default: `now()` |

---

## API Endpoints

### 🔓 Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/` | Health check — returns server status & version |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Login — returns `user_id` and `role` |

#### `POST /api/auth/register` — Request Body
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword",
  "role": "user"
}
```

#### `POST /api/auth/login` — Request Body
```json
{
  "email": "jane@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{ "message": "Login successful!", "user_id": 1, "role": "user" }
```

---

### 🔐 User Endpoints (Header: `User-Id: <id>` required)

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `POST` | `/api/predict` | Run AI pipeline — returns coaching advice |

#### `POST /api/predict` — Request Body
```json
{
  "domain": "health",
  "text": "I've been feeling very stressed lately and my heart rate is high.",
  "user_id": 1
}
```
**Response:**
```json
{
  "query_id": 42,
  "prediction_id": 17,
  "result_text": "Hey! 🌿 It looks like your stress levels are quite elevated...",
  "model_version": "gemini-2.5-pro",
  "confidence": null,
  "profile_memory": { "Stress_Level": "8", "Heart_Rate": "95" }
}
```

---

### 🛡️ Admin Endpoints (Header: `User-Id: <admin_id>` required, role must be `admin`)

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/api/admin/users` | Paginated list of all registered users |
| `DELETE` | `/api/admin/user/<id>` | Delete a non-admin user (returns 403 for admin) |
| `GET` | `/api/admin/queries` | Paginated query log with optional `domain` / `user_id` filter |
| `DELETE` | `/api/users/<id>` | Delete user (via user blueprint, also admin-guarded) |

#### `GET /api/admin/users?page=1&per_page=50`
**Response:**
```json
{
  "items": [{ "id": 1, "name": "Jane", "email": "jane@example.com", "role": "user", "is_active": true, "created_at": "2026-02-01T10:00:00" }],
  "total": 120,
  "page": 1,
  "per_page": 50
}
```

#### `GET /api/admin/queries?domain=health&user_id=5&page=1`
**Response:**
```json
{
  "items": [{ "id": 42, "user_id": 5, "user_email": "jane@example.com", "domain": "health", "query_text": "...", "created_at": "...", "latest_result": "Hey! 🌿..." }],
  "total": 8,
  "page": 1,
  "per_page": 50
}
```

---

## User Interface — User App

**Location:** `user-ui/` | **Framework:** React 19 + Framer Motion | **Port:** `3000`

### Pages
| Page | File | Description |
| :--- | :--- | :--- |
| **Home** | `HomePage.jsx` | Landing page with animated hero, features section, and CTA |
| **Login** | `LoginPage.jsx` | Animated login form with validation |
| **Register** | `RegisterPage.jsx` | New account creation form |
| **Domain Selector** | `DomainSelectorPage.jsx` | Card-based domain picker (Career / Finance / Health / Relationship) |
| **Chat** | `ChatPage.jsx` | Real-time chat interface with the AI coach |

### Key Libraries
- `react-router-dom` v7 — Client-side routing
- `axios` — API communication with the Flask backend
- `framer-motion` — Page transitions and micro-animations

---

## User Interface — Admin Dashboard

**Location:** `admin-ui/LIFEALLY/` | **Framework:** Vite + React 18 + TypeScript | **Port:** `5173`

### Pages
| Page | File | Description |
| :--- | :--- | :--- |
| **Login** | `Login.tsx` | Admin-only login form |
| **Dashboard** | `Dashboard.tsx` | Overview stats + domain analytics chart |
| **Users** | `Users.tsx` | Paginated user list with delete action |
| **User View** | `UserView.tsx` | Individual user detail view |
| **Queries** | `Queries.tsx` | Full query log with domain filter |
| **Profile** | `Profile.tsx` | Admin's own account details |
| **Settings** | `Settings.tsx` | Admin account settings |

### Key Components
| Component | Description |
| :--- | :--- |
| `Sidebar.tsx` | Navigation sidebar |
| `Topbar.tsx` | Header with page title and user info |
| `DomainChart.tsx` | Chart.js bar/doughnut chart of query counts per domain |
| `AdminTodo.tsx` | Internal task manager for admin actions |
| `UserDetailModal.tsx` | Pop-up modal showing full user info |
| `QueryDetailModal.tsx` | Pop-up modal with query text + latest AI response |

### Key Libraries
- `@tanstack/react-query` — Server-state caching and fetching
- `chart.js` + `react-chartjs-2` — Analytics charts
- `react-bootstrap` + `bootstrap 5` — UI component library
- `react-icons` — Icon set
- `axios` — API communication
- `dayjs` — Date formatting

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- A [Google AI Studio](https://aistudio.google.com/) API Key

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/LifeAlly.git
cd LifeAlly
```

### 2. Backend Setup

```bash
# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt

# Copy environment template and fill in your values
copy .env.example .env
```

Edit `.env` with your credentials (see [Environment Variables](#environment-variables) below).

```bash
# Create the PostgreSQL database
# (ensure PostgreSQL is running and the DB_USER has privileges)
createdb lifeally

# Apply database migrations
flask db upgrade

# Start the Flask backend
python app.py
```

The backend will be available at `http://localhost:5000`.

---

### 3. User UI Setup

```bash
cd user-ui
npm install
npm start
```

The user chat app will be available at `http://localhost:3000`.

---

### 4. Admin Dashboard Setup

```bash
cd admin-ui/LIFEALLY
npm install
npm run dev
```

The admin dashboard will be available at `http://localhost:5173`.

---

### 5. Creating an Admin Account

Register a user normally via the API, then manually set the role in your database:

```sql
UPDATE user_profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values:

```env
# ─── Google Gemini ──────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL_NAME=gemini-2.5-pro          # optional, defaults to gemini-2.5-pro

# ─── Flask ──────────────────────────────────────────────
FLASK_ENV=development
SECRET_KEY=generate_a_long_random_secret_token_here

# ─── PostgreSQL Database ────────────────────────────────
DB_NAME=lifeally
DB_USER=postgres
DB_PASSWORD=your_db_password_here
DB_HOST=127.0.0.1
DB_PORT=5432
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore` by default.

---

## Security Design

| Concern | Implementation |
| :--- | :--- |
| **Password Storage** | `werkzeug pbkdf2:sha256` hashing for new accounts; legacy Bcrypt hash support as fallback |
| **Role-Based Access Control** | `@admin_required` decorator validates `User-Id` header & checks `role == 'admin'` on every admin route |
| **Admin Account Protection** | Server-side check blocks deletion of any `role == 'admin'` account — cannot be bypassed via API |
| **API Secret Management** | All secrets stored in `.env` file; excluded from git via `.gitignore` |
| **CORS Policy** | Only `http://localhost:3000` and `http://localhost:5173` are whitelisted |
| **Email Normalization** | Unicode NFKC normalization + lowercase + strip applied to all email inputs to prevent homograph attacks |
| **Error Isolation** | `db.session.rollback()` on all 500 errors to prevent partial writes |

---

## Notebooks & Model Training

All ML models were trained in Jupyter notebooks located in the `notebooks/` directory:

| Notebook | Domain | Models Trained |
| :--- | :--- | :--- |
| `career_models.ipynb` | Career | `career_admission`, `career_growth`, `career_profession` |
| `finance_models.ipynb` | Finance | `finance_disposable_income`, `finance_loan`, `finance_personal_tracker` |
| `health_models.ipynb` | Health | `health_mental`, `health_heart` (XGBoost) |
| `relationship_models.ipynb` | Relationship | `relationship_emotion`, `relationship`, `relationship_knn` |
| `lifeally_langgraph_pipeline.ipynb` | All | LangGraph pipeline prototype & experimentation |

Training data is organized in the `data/` directory under `career/`, `finance/`, `health/`, and `relationships/` subdirectories.

> 📦 Model `.pkl` files are tracked with **Git LFS** due to their large binary sizes.

---

## Use Cases

### User Use Cases
| ID | Use Case | Description |
| :--- | :--- | :--- |
| UC-101 | User Registration | Create a new account with email and password |
| UC-102 | User Login | Authenticate into the platform |
| UC-103 | Profile View | View current account details |
| UC-201 | Select Domain | Choose Career, Finance, Health, or Relationship |
| UC-202 | Interactive Chat | Send natural language queries to the AI Coach |
| UC-203 | Structured Advice | Receive empathetic coaching based on ML predictions |
| UC-204 | Chat History | Review past conversations and AI-generated insights |

### Admin Use Cases
| ID | Use Case | Description |
| :--- | :--- | :--- |
| UC-301 | User Directory | View paginated list of all registered users |
| UC-302 | User Deletion | Remove users (admin accounts are protected) |
| UC-303 | Query Monitoring | Audit user queries and AI responses |
| UC-304 | Domain Analytics | View trends on which domains are most active |
| UC-305 | Admin Task Manager | Track and manage administrative to-do items |

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

```
MIT License · Copyright (c) 2026 · LifeAlly
```

---

<div align="center">

**Built with ❤️ using Python, Flask, React, and Google Gemini**

*LifeAlly — README v2.0.0 · February 2026*

</div>
