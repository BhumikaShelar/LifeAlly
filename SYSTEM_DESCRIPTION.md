# 4. System Description

## 4.1 Database Description Table (Attribute, Datatype and Constraint)

| Table Name | Attribute | Data Type | Constraint |
| :--- | :--- | :--- | :--- |
| **user_profiles** | id<br>name<br>email<br>password_hash<br>role<br>is_active<br>created_at | Int<br>Varchar(100)<br>Varchar(120)<br>Varchar(255)<br>Varchar(10)<br>Boolean<br>DateTime | Primary Key<br>Not Null<br>Unique, Not Null<br>Not Null<br>Default: user<br>Default: true<br>Default: now() |
| **user_profile_memories** | id<br>user_id<br>domain<br>profile_json<br>updated_at | Int<br>Int<br>Varchar(100)<br>JSONB<br>DateTime | Primary Key<br>Foreign Key<br>Not Null<br>Not Null<br>Default: now() |
| **user_queries** | id<br>user_id<br>domain<br>query_text<br>created_at | Int<br>Int<br>Varchar(100)<br>Text<br>DateTime | Primary Key<br>Foreign Key<br>Not Null<br>Not Null<br>Default: now() |
| **prediction_results** | id<br>query_id<br>result_text<br>created_at | Int<br>Int<br>Text<br>DateTime | Primary Key<br>Foreign Key<br>Not Null<br>Default: now() |
| **admin_tasks** | id<br>admin_id<br>action<br>target_id<br>details<br>created_at | Int<br>Int<br>Varchar(100)<br>Int<br>Text<br>DateTime | Primary Key<br>Foreign Key<br>Not Null<br>Nullable<br>Nullable<br>Default: now() |

---

*LifeAlly — System Description v1.0.0 · February 2026*
