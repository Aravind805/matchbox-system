from backend.app import app
from backend.models import db, Barrel, Chemical
from datetime import date

with app.app_context():

    # -------- INPUT (ADMIN ENTERS THIS) --------
    barrel_code = "262G"          # example
    chemical_code = "G"           # must exist
    initial_stock_kg = 500.0       # example kg

    # ------------------------------------------
    chemical = Chemical.query.filter_by(code=chemical_code).first()

    if not chemical:
        print(f"❌ Chemical '{chemical_code}' does not exist")
        exit()

    exists = Barrel.query.filter_by(barrel_code=barrel_code).first()
    if exists:
        print(f"ℹ️ Barrel '{barrel_code}' already exists")
        exit()

    barrel = Barrel(
        barrel_code=barrel_code,
        chemical_id=chemical.id,
        initial_stock_kg=initial_stock_kg,
        current_stock_kg=initial_stock_kg,
        opening_date=date.today(),
        is_active=True
    )

    db.session.add(barrel)
    db.session.commit()

    print(f"✅ Barrel '{barrel_code}' added successfully")
