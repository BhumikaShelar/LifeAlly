# LifeAlly — Use Case Diagram

This diagram visualizes the relationships between the platform's actors and their primary interactions with the system.

```mermaid
useCaseDiagram
    actor "👤 User" as User
    actor "🛡️ Admin" as Admin

    package "LifeAlly Platform" {
        usecase "Register/Login" as UC1
        usecase "View Profile" as UC2
        
        usecase "Select AI Domain\n(Career, Finance, Health, Relationship)" as UC3
        usecase "Consult AI Coach\n(Hybrid Pipeline)" as UC4
        usecase "View Advice History" as UC5
        
        usecase "Manage User Directory" as UC6
        usecase "Audit User Queries" as UC7
        usecase "Analyze Domain Trends" as UC8
        usecase "Delete User Account\n(Self-Protection Enabled)" as UC9
    }

    %% User Interactions
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5

    %% Admin Interactions
    Admin --> UC1
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9

    %% Styling
    style User fill:#3b82f6,color:#fff,stroke:#1d4ed8
    style Admin fill:#f97316,color:#fff,stroke:#c2410c
    style UC4 fill:#8b5cf6,color:#fff,stroke:#6d28d9
```

---

### Description of Components

1.  **Actor: User**: Consumers of the AI coaching service. They provide natural language input and receive domain-optimized advice.
2.  **Actor: Admin**: Oversight role. They monitor platform usage, system performance (via analytics), and manage the user lifecycle.
3.  **Hybrid Pipeline (UC4)**: This is the system's "Brain," where Gemini 2.5 Pro and XGBoost/Sklearn models collaborate to provide insights.
4.  **Self-Protection (UC9)**: A critical administrative safety feature that prevents the deletion of admin accounts from the dashboard.

---

*LifeAlly — Documentation v1.0.0 · February 2026*
