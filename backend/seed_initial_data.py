from backend.app import app
from backend.models import db, User, Chemical

with app.app_context():

    # --------------------
    # ADMIN USER
    # --------------------
    admin = User.query.filter_by(role="admin").first()
    if not admin:
        admin = User(
            name="Admin",
            role="admin",
            fcm_token=None  # will be set later from React
        )
        db.session.add(admin)
        print("✅ Admin user created")
    else:
        print("ℹ️ Admin user already exists")

    # --------------------
    # CHEMICALS (CODES ONLY)
    # --------------------
    chemical_codes = ["G", "V", "W", "K", "JW"]

    for code in chemical_codes:
        exists = Chemical.query.filter_by(code=code).first()
        if not exists:
            chem = Chemical(code=code)
            db.session.add(chem)
            print(f"✅ Chemical {code} added")
        else:
            print(f"ℹ️ Chemical {code} already exists")

    db.session.commit()
