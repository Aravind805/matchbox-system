def calculate_efficiency(sheets_produced, chemical_used_kg, expected_sheets_per_kg):
    actual_sheets_per_kg = sheets_produced / chemical_used_kg
    efficiency_percent = (actual_sheets_per_kg / expected_sheets_per_kg) * 100

    return round(actual_sheets_per_kg, 2), round(efficiency_percent, 2)
