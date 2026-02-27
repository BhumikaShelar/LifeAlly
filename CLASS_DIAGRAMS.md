# 3. Class Diagram

A class diagram is a type of structural diagram used in object-oriented design to represent the classes of a system and the relationships among them. It provides a blueprint of how different entities (classes) in a system interact and organize data. Each class is depicted as a box divided into three parts: the top section shows the class name, the middle section lists its attributes (data members), and the bottom section contains its methods (functions). Relationships like inheritance, association, and dependency are shown using connecting lines. Class diagrams are widely used in software design to visualize and plan object-oriented systems.

---

```mermaid
classDiagram
    direction LR

    class UserProfile {
        - id : Int
        - name : String
        - email : String
        - password_hash : String
        - role : String
        - is_active : Boolean
        - created_at : DateTime
        + register()
        + login()
        + logout()
        + set_password()
        + check_password()
        + view_profile()
    }

    class UserProfileMemory {
        - id : Int
        - user_id : Int
        - domain : String
        - profile_json : JSONB
        - updated_at : DateTime
        + get_memory()
        + update_memory()
    }

    class UserQuery {
        - id : Int
        - user_id : Int
        - domain : String
        - query_text : Text
        - created_at : DateTime
        + submit_query()
        + view_query()
    }

    class PredictionResult {
        - id : Int
        - query_id : Int
        - result_text : Text
        - created_at : DateTime
        + get_result()
        + view_result()
    }

    class AIPipeline {
        - GEMINI_API_KEY : String
        - MODELS : Dict
        - DOMAIN_MODELS : Dict
        + run_pipeline()
        + extract_features()
        + get_model_features()
        + update_profile()
        + invoke_gemini()
    }

    class AdminBlueprint {
        - admin_id : Int
        - role : String
        + list_users()
        + delete_user()
        + list_queries()
        + view_dashboard()
        + view_analytics()
        + manage_tasks()
    }

    UserProfile "1" --> "0..*" UserQuery : submits
    UserProfile "1" --> "0..*" UserProfileMemory : has memory
    UserQuery "1" --> "0..*" PredictionResult : generates
    UserQuery --> AIPipeline : processed by
    AIPipeline --> PredictionResult : creates
    AdminBlueprint "1" --> "0..*" UserProfile : manages
    AdminBlueprint "1" --> "0..*" UserQuery : views
```

---

*LifeAlly — Class Diagram v1.0.0 · February 2026*
