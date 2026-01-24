from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import JSONB

# Optional: bcrypt fallback for existing bcrypt hashes in DB
# Requires 'bcrypt' package to be installed in your virtualenv.
try:
    import bcrypt  # type: ignore
    _HAS_BCRYPT = True
except Exception:
    _HAS_BCRYPT = False

class UserProfile(db.Model):
    __tablename__ = 'user_profiles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False, default='changeme')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    role = db.Column(db.String(10), nullable=False, default='user')
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    queries = db.relationship(
        'UserQuery', backref='user', lazy=True, cascade="all, delete-orphan"
    )
    memories = db.relationship(
        'UserProfileMemory', backref='user', lazy=True, cascade="all, delete-orphan"
    )

    def set_password(self, password):
        # Use werkzeug's generate_password_hash for new/updated passwords
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """
        First try werkzeug's check_password_hash (for pbkdf2:... style hashes).
        If that fails with a ValueError (invalid hash format), and bcrypt is available,
        attempt bcrypt.checkpw for "$2b$..." style hashes saved in the DB.
        Returns True if password matches, otherwise False.
        """
        # Defensive: ensure there is a stored hash
        if not self.password_hash:
            return False

        # Try werkzeug style first
        try:
            if check_password_hash(self.password_hash, password):
                return True
        except ValueError:
            # Invalid format for werkzeug (e.g. hash starts with "$2b$...").
            pass
        except Exception:
            # Unexpected error from werkzeug check -> fail safe and continue to bcrypt attempt.
            pass

        # Fallback: try bcrypt if available and the stored hash looks like a bcrypt hash
        if _HAS_BCRYPT and isinstance(self.password_hash, str) and self.password_hash.startswith("$2"):
            try:
                stored = self.password_hash.encode("utf-8")
                return bcrypt.checkpw(password.encode("utf-8"), stored)
            except Exception:
                return False

        # No match
        return False

class UserProfileMemory(db.Model):
    __tablename__ = "user_profile_memories"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id', ondelete='CASCADE'), nullable=False)
    domain = db.Column(db.String(100), nullable=False)
    profile_json = db.Column(JSONB, nullable=False, default=dict)
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    __table_args__ = (db.UniqueConstraint('user_id', 'domain', name='_user_domain_uc'),)

class UserQuery(db.Model):
    __tablename__ = 'user_queries'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id', ondelete='CASCADE'), nullable=True)
    domain = db.Column(db.String(100), nullable=False)
    query_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    results = db.relationship(
        'PredictionResult', backref='query', lazy=True, cascade="all, delete-orphan"
    )

class PredictionResult(db.Model):
    __tablename__ = 'prediction_results'
    id = db.Column(db.Integer, primary_key=True)
    query_id = db.Column(db.Integer, db.ForeignKey('user_queries.id', ondelete='CASCADE'), nullable=False)
    result_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

