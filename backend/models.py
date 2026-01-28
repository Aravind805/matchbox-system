from flask_sqlalchemy import SQLAlchemy
from datetime import date, datetime

db = SQLAlchemy()

# --------------------
# USERS
# --------------------
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)

    # 🔑 LOGIN FIELDS
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)

    fcm_token = db.Column(db.Text)


class ChemicalRefill(db.Model):
    __tablename__ = "chemical_refills"

    id = db.Column(db.Integer, primary_key=True)
    barrel_id = db.Column(db.Integer, db.ForeignKey("barrels.id"), nullable=False)
    added_kg = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)



# --------------------
# CHEMICALS (CODES ONLY)
# --------------------
class Chemical(db.Model):
    __tablename__ = "chemicals"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(2), unique=True, nullable=False)  # G, V, W, K, JW
    is_active = db.Column(db.Boolean, default=True)

# --------------------
# BRANDS (WITH STANDARD SHEETS/KG)
# --------------------
class Brand(db.Model):
    __tablename__ = "brands"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)
    expected_sheets_per_kg = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, default=True)

# --------------------
# BARRELS
# --------------------
class Barrel(db.Model):
    __tablename__ = "barrels"

    id = db.Column(db.Integer, primary_key=True)
    barrel_code = db.Column(db.String(10), unique=True, nullable=False)

    chemical_id = db.Column(db.Integer, db.ForeignKey("chemicals.id"), nullable=False)

    initial_stock_kg = db.Column(db.Float, nullable=False)
    current_stock_kg = db.Column(db.Float, nullable=False)

    opening_date = db.Column(db.Date, default=date.today)
    is_active = db.Column(db.Boolean, default=True)

    chemical = db.relationship("Chemical")

# --------------------
# PRODUCTION ENTRIES
# --------------------
class ProductionEntry(db.Model):
    __tablename__ = "production_entries"

    id = db.Column(db.Integer, primary_key=True)

    barrel_id = db.Column(db.Integer, db.ForeignKey("barrels.id"), nullable=False)
    brand_id = db.Column(db.Integer, db.ForeignKey("brands.id"), nullable=False)

    chemical_used_kg = db.Column(db.Float, nullable=False)
    sheets_produced = db.Column(db.Integer, nullable=False)
    efficiency = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    barrel = db.relationship("Barrel")
    brand = db.relationship("Brand")
