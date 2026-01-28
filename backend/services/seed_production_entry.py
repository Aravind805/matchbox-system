from backend.app import app
from backend.models import db, Barrel, Brand, ProductionEntry
from backend.services.calculations import calculate_efficiency

with app.app_context():

    # -------- EMPLOYEE INPUT (SIMULATED) --------
    barrel_code = "261G"          # must exist
    brand_name = "Balloon offine" # must exist in brands
    chemical_used_kg = 5.0
    sheets_produced = 9200
    # -------------------------------------------

    barrel = Barrel.query.filter_by(barrel_code=barrel_code, is_active=True).first()
    if not barrel:
        print("❌ Barrel not found or inactive")
        exit()

    if barrel.current_stock_kg < chemical_used_kg:
        print("❌ Insufficient chemical stock")
        exit()

    brand = Brand.query.filter_by(name=brand_name, is_active=True).first()
    if not brand:
        print("❌ Brand not found")
        exit()

    # -------- DEDUCT STOCK --------
    barrel.current_stock_kg -= chemical_used_kg
    if barrel.current_stock_kg == 0:
        barrel.is_active = False

    # -------- CALCULATE --------
    actual, efficiency = calculate_efficiency(
        sheets_produced,
        chemical_used_kg,
        brand.expected_sheets_per_kg
    )

    # -------- SAVE ENTRY --------
    entry = ProductionEntry(
        barrel_id=barrel.id,
        brand_id=brand.id,
        chemical_used_kg=chemical_used_kg,
        sheets_produced=sheets_produced
    )

    db.session.add(entry)
    db.session.commit()

    print("✅ Production entry saved")
    print(f"Actual sheets/kg  : {actual}")
    print(f"Efficiency (%)    : {efficiency}")
    print(f"Remaining stock  : {barrel.current_stock_kg} kg")
