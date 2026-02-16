import os
import json
from flask import Flask,request, jsonify
from flask_cors import CORS
from backend.config import Config
from backend.models import db, User, Brand, Barrel, ProductionEntry
import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging
from backend.models import ChemicalRefill
from datetime import datetime, timedelta
from sqlalchemy import func
import firebase_admin
from firebase_admin import credentials

app = Flask(__name__)
app.config.from_object(Config)
CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    supports_credentials=True
)


db.init_app(app)

with app.app_context():
    db.create_all()

if not firebase_admin._apps:
    if os.getenv("FIREBASE_SERVICE_ACCOUNT"):
        # Production (Render)
        cred = credentials.Certificate(
            json.loads(os.environ["FIREBASE_SERVICE_ACCOUNT"])
        )
    else:
        # Local development
        cred = credentials.Certificate(
            "backend/firebase_service_account.json"
        )
    print("FIREBASE_SERVICE_ACCOUNT present:", bool(os.getenv("FIREBASE_SERVICE_ACCOUNT")))
    firebase_admin.initialize_app(cred)

@app.route("/")
def home():
    return "Backend is running!"

print("LOGIN ROUTE LOADED")
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing request body"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    user = User.query.filter_by(username=username).first()

    if not user or user.password != password:
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({
        "id": user.id,
        "name": user.name,
        "role": user.role
    }), 200

@app.route("/api/register-fcm-token", methods=["POST"])
def register_fcm_token():
    data = request.get_json()

    token = data.get("token")
    if not token:
        return jsonify({"error": "Token missing"}), 400

    admin = User.query.filter_by(role="admin").first()

    # 🔥 FIX: create admin if missing
    if not admin:
        admin = User(
            name="Admin",
            role="admin"
        )
        db.session.add(admin)
        db.session.commit()

    admin.fcm_token = token
    db.session.commit()

    return jsonify({"message": "FCM token saved successfully"}), 200

@app.route("/api/production-entry", methods=["POST"])
def create_production_entry():
    data = request.get_json()

    barrel_id = data.get("barrel_id")
    brand_id = data.get("brand_id")
    chemical_used_kg = data.get("chemical_used_kg")
    sheets_produced = data.get("sheets_produced")

    if not all([barrel_id, brand_id, chemical_used_kg, sheets_produced]):
        return jsonify({"error": "Missing required fields"}), 400

    barrel = Barrel.query.get(barrel_id)
    if not barrel or not barrel.is_active:
        return jsonify({"error": "Invalid or inactive barrel"}), 404

    if barrel.current_stock_kg < chemical_used_kg:
        return jsonify({"error": "Not enough chemical in barrel"}), 400

    brand = Brand.query.get(brand_id)
    if not brand or not brand.is_active:
        return jsonify({"error": "Invalid or inactive brand"}), 404

    expected_sheets = chemical_used_kg * brand.expected_sheets_per_kg
    efficiency = (sheets_produced / expected_sheets) * 100

    barrel.current_stock_kg -= chemical_used_kg

    entry = ProductionEntry(
        barrel_id=barrel.id,
        brand_id=brand.id,
        chemical_used_kg=chemical_used_kg,
        sheets_produced=sheets_produced,
        efficiency=round(efficiency, 2)
    )

    db.session.add(entry)
    db.session.commit()

    admin = User.query.filter_by(role="admin").first()
    if admin and admin.fcm_token:
        message = (
            f"Brand: {brand.name}\n"
            f"Chemical: {barrel.chemical.code}\n"
            f"Kg used: {chemical_used_kg}\n"
            f"Sheets: {sheets_produced}\n"
            f"Efficiency: {efficiency:.2f}%"
        )

        send_push_notification(
            admin.fcm_token,
            "Production Update",
            message
        )

    return jsonify({
    "message": "Production entry saved successfully",

    # existing
    "efficiency": round(efficiency, 2),

    # ⭐ MISSING (ADD THESE)
    "sheets_produced": sheets_produced,
    "chemical_used_kg": chemical_used_kg,
    "expected_sheets_per_kg": brand.expected_sheets_per_kg,
    "expected_sheets": expected_sheets
}), 201

@app.route("/api/brands", methods=["GET"])
def get_brands():
    brands = Brand.query.all()
    print("DEBUG BRANDS:", [(b.name, b.is_active) for b in brands])
    return jsonify([
        {
            "id": b.id,
            "name": b.name,
            "expected_sheets_per_kg": b.expected_sheets_per_kg,
            "is_active": bool(b.is_active)
        }
        for b in brands
    ])

@app.route("/api/barrels", methods=["GET"])
def get_barrels():
    barrels = Barrel.query.filter_by(is_active=True).all()

    return jsonify([
        {
            "id": b.id,
            "barrel_code": b.barrel_code,
            "current_stock_kg": b.current_stock_kg,
            "chemical": {
                "code": b.chemical.code
            }
        }
        for b in barrels
    ])

@app.route("/api/production-entries", methods=["GET"])
def get_production_entries():
    entries = (
        ProductionEntry.query
        .order_by(ProductionEntry.created_at.desc())
        .limit(50)
        .all()
    )

    return jsonify([
    {
        "id": e.id,
        "created_at": e.created_at.strftime("%Y-%m-%d %H:%M"),
        "barrel": e.barrel.barrel_code,
        "brand": e.brand.name,

        "chemical_used_kg": e.chemical_used_kg,
        "sheets_produced": e.sheets_produced,

        # ⭐ ADD ONLY THESE
        "expected_sheets_per_kg": e.brand.expected_sheets_per_kg,
        "expected_sheets": e.chemical_used_kg * e.brand.expected_sheets_per_kg
    }
    for e in entries
])

@app.route("/api/production-entry/<int:entry_id>", methods=["DELETE"])
def delete_production_entry(entry_id):

    entry = ProductionEntry.query.get(entry_id)
    if not entry:
        return jsonify({"error": "Production entry not found"}), 404

    barrel = Barrel.query.get(entry.barrel_id)
    if not barrel:
        return jsonify({"error": "Associated barrel not found"}), 400

    try:
        # Restore stock
        barrel.current_stock_kg += entry.chemical_used_kg

        # Delete production entry
        db.session.delete(entry)
        db.session.commit()

        return jsonify({
            "message": "Production entry deleted and stock restored"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/barrels/<int:barrel_id>/refill", methods=["POST"])
def refill_barrel(barrel_id):

    data = request.get_json(force=True)
    added_kg = data.get("added_kg")

    if not added_kg or added_kg <= 0:
        return jsonify({"error": "Invalid added_kg"}), 400

    barrel = Barrel.query.get(barrel_id)
    if not barrel:
        return jsonify({"error": "Barrel not found"}), 404

    try:
        # Add stock
        barrel.current_stock_kg += added_kg

        # Log refill
        refill = ChemicalRefill(
            barrel_id=barrel_id,
            added_kg=added_kg
        )

        db.session.add(refill)
        db.session.commit()

        return jsonify({
            "message": "Chemical refill added successfully",
            "new_stock": barrel.current_stock_kg
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/brands", methods=["POST"])
def add_brand():
    data = request.get_json(force=True)

    name = data.get("name")
    expected = data.get("expected_sheets_per_kg")

    if not name or not expected or expected <= 0:
        return jsonify({"error": "Invalid brand data"}), 400

    existing = Brand.query.filter_by(name=name).first()
    if existing:
        return jsonify({"error": "Brand already exists"}), 400

    try:
        brand = Brand(
            name=name,
            expected_sheets_per_kg=expected,
            is_active=True
        )

        db.session.add(brand)
        db.session.commit()

        return jsonify({
            "message": "Brand added successfully",
            "brand": {
                "id": brand.id,
                "name": brand.name,
                "expected_sheets_per_kg": brand.expected_sheets_per_kg
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/brands/<int:brand_id>", methods=["PUT"])
def update_brand(brand_id):
    brand = Brand.query.get(brand_id)
    if not brand:
        return jsonify({"error": "Brand not found"}), 404

    data = request.get_json()
    expected = data.get("expected_sheets_per_kg")

    if expected is None or expected <= 0:
        return jsonify({"error": "Invalid expected sheets value"}), 400

    brand.expected_sheets_per_kg = expected
    db.session.commit()

    return jsonify({"message": "Brand updated successfully"}), 200

@app.route("/api/brands/<int:brand_id>", methods=["DELETE"])
def delete_brand(brand_id):
    brand = Brand.query.get(brand_id)
    if not brand:
        return jsonify({"error": "Brand not found"}), 404

    db.session.delete(brand)
    db.session.commit()

    return jsonify({"message": "Brand deleted successfully"}), 200


@app.route("/api/reports/production-summary", methods=["GET"])
def production_summary():

    range_type = request.args.get("range")

    if range_type not in ["daily", "weekly"]:
        return jsonify({"error": "range must be daily or weekly"}), 400

    now = datetime.utcnow()

    if range_type == "daily":
        start_date = datetime(now.year, now.month, now.day)
    else:  # weekly
        start_date = now - timedelta(days=7)

    results = (
        db.session.query(
            Brand.name.label("brand"),
            func.sum(ProductionEntry.sheets_produced).label("total_sheets"),
            func.sum(ProductionEntry.chemical_used_kg).label("total_chemical")
        )
        .join(Brand, Brand.id == ProductionEntry.brand_id)
        .filter(ProductionEntry.created_at >= start_date)
        .group_by(Brand.name)
        .all()
    )

    response = []
    for row in results:
        response.append({
            "brand": row.brand,
            "total_sheets": float(row.total_sheets or 0),
            "total_chemical": float(row.total_chemical or 0)
        })

    return jsonify(response), 200


def send_push_notification(token, title, body):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        token=token,
    )

    response = messaging.send(message)
    print("✅ Notification sent, message ID:", response)



if __name__ == "__main__":
    app.run(debug=True)
