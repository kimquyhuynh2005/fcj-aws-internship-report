import http.server
import socketserver
import json
import urllib.parse
import os
import sys
import pandas as pd
import numpy as np
import pickle

# Setup paths
DEMO_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(DEMO_DIR)
sys.path.append(os.path.join(PROJECT_ROOT, 'week6_deployment'))
sys.path.append(os.path.join(PROJECT_ROOT, 'week3_xgboost'))

from build_real_features import load_full_history, build_features_for_store

PORT = 8000

# Load model & data into memory on server startup
MODEL_PATH = os.path.join(PROJECT_ROOT, "week3_xgboost", "models", "xgboost_model.pkl")
print("Loading XGBoost model from:", MODEL_PATH)
with open(MODEL_PATH, "rb") as f:
    MODEL = pickle.load(f)

print("Loading historical sales dataset...")
DF_HISTORY = load_full_history()
print("Server initialization complete.")

FEATURES_ORDER = [
    'Store', 'DayOfWeek', 'Promo', 'StateHoliday', 'SchoolHoliday',
    'StoreType', 'Assortment', 'CompetitionDistance',
    'Promo2', 'Year', 'Month', 'Day', 'WeekOfYear', 'IsWeekend',
    'sales_lag_7', 'sales_lag_14', 'sales_lag_30',
    'rolling_mean_7', 'rolling_mean_14', 'rolling_mean_30',
    'rolling_std_7', 'rolling_std_14', 'rolling_std_30',
]

class ForecastRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DEMO_DIR, **kwargs)

    def do_POST(self):
        if self.path == '/api/forecast':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            req = json.loads(post_data.decode('utf-8'))
            
            store_id = int(req.get('store_id', 1))
            target_date = req.get('target_date', '2015-06-15')
            promo_override = req.get('promo', None)
            holiday_override = req.get('school_holiday', None)

            try:
                # 1. Build features for target store and date
                feats = build_features_for_store(DF_HISTORY, store_id, target_date)
                
                # Apply overrides if user modified inputs in UI
                if promo_override is not None:
                    feats['Promo'] = int(promo_override)
                if holiday_override is not None:
                    feats['SchoolHoliday'] = int(holiday_override)

                # Prepare DataFrame for XGBoost
                df_input = pd.DataFrame([feats])[FEATURES_ORDER]
                pred_val = float(MODEL.predict(df_input)[0])

                # 2. What-If Scenario: Calculate prediction if Promo was toggled
                feats_whatif = feats.copy()
                feats_whatif['Promo'] = 1 if feats['Promo'] == 0 else 0
                df_whatif = pd.DataFrame([feats_whatif])[FEATURES_ORDER]
                pred_whatif = float(MODEL.predict(df_whatif)[0])

                # 3. Get historical sales for past 14 days for trend chart
                target_dt = pd.to_datetime(target_date)
                store_history = DF_HISTORY[(DF_HISTORY['Store'] == store_id) & (DF_HISTORY['Date'] < target_dt)].tail(14)
                
                trend_dates = store_history['Date'].dt.strftime('%Y-%m-%d').tolist()
                trend_sales = [float(s) for s in store_history['Sales'].tolist()]

                # Get actual sales if target date exists in test set
                actual_row = DF_HISTORY[(DF_HISTORY['Store'] == store_id) & (DF_HISTORY['Date'] == target_dt)]
                actual_sales = float(actual_row.iloc[0]['Sales']) if len(actual_row) > 0 else None

                response_data = {
                    "status": "success",
                    "store_id": store_id,
                    "target_date": target_date,
                    "predicted_sales": round(pred_val, 2),
                    "actual_sales": round(actual_sales, 2) if actual_sales else None,
                    "error_pct": round(abs(actual_sales - pred_val) / actual_sales * 100, 2) if actual_sales else None,
                    "whatif": {
                        "promo_status": feats_whatif['Promo'],
                        "predicted_sales": round(pred_whatif, 2),
                        "diff_pct": round((pred_whatif - pred_val) / pred_val * 100, 2)
                    },
                    "features": feats,
                    "history_trend": {
                        "dates": trend_dates,
                        "sales": trend_sales
                    }
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
                
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            self.send_error(404, "Endpoint not found")

    def do_GET(self):
        if self.path == '/api/stores':
            stores = sorted([int(s) for s in DF_HISTORY['Store'].unique()[:50]])
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"stores": stores}).encode('utf-8'))
        else:
            super().do_GET()

if __name__ == "__main__":
    print(f"🚀 Starting ML Forecast Web UI Server on http://localhost:{PORT}")
    with socketserver.TCPServer(("", PORT), ForecastRequestHandler) as httpd:
        httpd.serve_forever()
