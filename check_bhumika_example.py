from app import create_app
from extensions import db
from models import UserProfile

app = create_app()
with app.app_context():
    # Replace the email with the user you want to update
    u = UserProfile.query.filter(UserProfile.email.ilike("user@example.com")).first()
    print("found:", bool(u))
    if u:
        # Replace 'your_password_here' with the desired password
        u.set_password("your_password_here") 
        u.role = "admin"
        u.is_active = True
        db.session.commit()
        print("updated password for", u.email)
    else:
        print("user not found")
