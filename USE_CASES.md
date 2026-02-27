# LifeAlly — Use Case Documentation

> This document outlines the primary use cases for the **LifeAlly** platform, detailing how different actors interact with the system to achieve specific goals.

---

## 👥 Actors

| Actor | Description |
| :--- | :--- |
| **User** | A person seeking AI-driven coaching and life advice. |
| **Admin** | A system administrator responsible for user management and platform analytics. |

---

## 📋 Use Case Summary

### 1. Account Management
| ID | Use Case | Actor | Description |
| :--- | :--- | :--- | :--- |
| **UC-101** | **User Registration** | User | Create a new account using email and password. |
| **UC-102** | **User Login** | User/Admin | Authenticate into the system to access personalized features. |
| **UC-103** | **Profile View** | User | View current account details and role. |

### 2. AI Coaching (User)
| ID | Use Case | Actor | Description |
| :--- | :--- | :--- | :--- |
| **UC-201** | **Select Domain** | User | Choose between Career, Finance, Health, or Relationship coaching. |
| **UC-202** | **Interactive Chat** | User | Send natural language queries to the AI Coach. |
| **UC-203** | **Structured Advice** | User | Receive empathetic, emoji-rich coaching based on numerical ML predictions. |
| **UC-204** | **Chat History** | User | Review past conversations and AI-generated insights. |

### 3. Platform Administration (Admin)
| ID | Use Case | Actor | Description |
| :--- | :--- | :--- | :--- |
| **UC-301** | **User Directory** | Admin | View a paginated list of all registered users on the platform. |
| **UC-302** | **User Deletion** | Admin | Remove users from the platform (protected against admin self-deletion). |
| **UC-303** | **Query Monitoring** | Admin | Audit user queries and AI responses for quality and safety. |
| **UC-304** | **Domain Analytics** | Admin | View trends on which coaching domains are most active. |

---

## 🚀 Key User Flows

### UC-202: The Hybrid AI Chat Flow
1. **Initiation**: User selects a domain (e.g., **Health**) and types: *"I've been feeling stressed and my heart rate is slightly high."*
2. **Extraction**: Gemini 2.5 Pro extracts numerical features (Stess Level, Heart Rate, etc.).
3. **ML Prediction**: The specialized **Heart Health XGBoost** model computes a risk score.
4. **Synthesis**: Gemini receives the score and generates an encouraging response: *"Hey! 🌿 It looks like your stress is at a 7/10. Let's practice some deep breathing..."*
5. **Memory**: The system updates the `user_profile_memories` table to 'remember' the user's current health state.

---

## 🛠️ Security & Constraints
- **Role-Based Access (RBAC)**: Only actors with the `admin` role can access `UC-3XX` endpoints.
- **Data Privacy**: Users can only see their own `UC-204` history.
- **Admin Safety**: The system explicitly blocks the deletion of any account with the `admin` role to prevent lockout.

---

*LifeAlly — Use Case Manual v1.0.0 · February 2026*
