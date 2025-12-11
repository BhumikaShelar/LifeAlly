from app import create_app
from extensions import db
from models import UserProfile

app = create_app()
with app.app_context():
    u = UserProfile.query.filter(UserProfile.email.ilike("shelarbhumika078@gmail.com")).first()
    print("found:", bool(u))
    if u:
        u.set_password("admin321")
        u.role = "admin"
        u.is_active = True
        db.session.commit()
        print("updated password for", u.email)
    else:
        print("user not found")