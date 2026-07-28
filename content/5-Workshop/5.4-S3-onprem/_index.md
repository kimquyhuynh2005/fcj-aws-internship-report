---
title: "Model Training & Evaluation (XGBoost vs LSTM)"
date: 2026-06-06
weight: 4
chapter: false
pre: "<b>5.4. </b>"
---

## Step 4: Model Training

### Why XGBoost?

We trained and compared two models:

| Model | Test RMSE | Test MAPE | Decision |
|-------|----------|----------|---------|
| **XGBoost 1.7.6** | **925.28** | **9.92%** | ✅ Production |
| PyTorch LSTM | 3,044.43 | 32.79% | ❌ Experiment |

> **Conclusion:** For tabular retail time series with 785K training rows, XGBoost significantly outperforms LSTM — especially when features are well-engineered.

### Train XGBoost

```bash
python week3_xgboost/train_xgboost.py
```

**Training script:**

```python
import xgboost as xgb
import pickle
import boto3

# Load processed data
train = pd.read_csv('data/processed/train.csv')
val   = pd.read_csv('data/processed/val.csv')

FEATURES = [
    'Store', 'DayOfWeek', 'Year', 'Month', 'Day', 'WeekOfYear',
    'DayOfYear', 'IsWeekend', 'IsDecember', 'Promo', 'StateHoliday',
    'SchoolHoliday', 'StoreType', 'Assortment', 'CompetitionDistance',
    'Promo2', 'rolling_mean_7', 'rolling_mean_14', 'rolling_mean_30',
    'lag_1', 'lag_7', 'lag_14'
]
TARGET = 'Sales'

X_train, y_train = train[FEATURES], train[TARGET]
X_val, y_val = val[FEATURES], val[TARGET]

# Train model
model = xgb.XGBRegressor(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    eval_metric='rmse',
    early_stopping_rounds=20
)

model.fit(
    X_train, y_train,
    eval_set=[(X_val, y_val)],
    verbose=100
)

# Evaluate
from sklearn.metrics import mean_squared_error
import numpy as np

val_pred = model.predict(X_val)
val_rmse = np.sqrt(mean_squared_error(y_val, val_pred))
val_mape = np.mean(np.abs((y_val - val_pred) / y_val)) * 100

print(f"Validation RMSE: {val_rmse:.2f}")
print(f"Validation MAPE: {val_mape:.2f}%")

# Test set
test = pd.read_csv('data/processed/test.csv')
X_test, y_test = test[FEATURES], test[TARGET]
test_pred = model.predict(X_test)
test_rmse = np.sqrt(mean_squared_error(y_test, test_pred))
test_mape = np.mean(np.abs((y_test - test_pred) / y_test)) * 100

print(f"\nTest RMSE: {test_rmse:.2f}")   # → 925.28
print(f"Test MAPE: {test_mape:.2f}%")   # → 9.92%

# Save model
with open('models/xgboost_model.pkl', 'wb') as f:
    pickle.dump(model, f)
print("Model saved ✅")
```

### Upload Model to S3

```python
import tarfile, os

# Package model for SageMaker
os.makedirs('model_package/code', exist_ok=True)
import shutil
shutil.copy('models/xgboost_model.pkl', 'model_package/')
shutil.copy('week6_deployment/inference.py', 'model_package/code/')

with tarfile.open('model.tar.gz', 'w:gz') as tar:
    tar.add('model_package/xgboost_model.pkl', arcname='xgboost_model.pkl')
    tar.add('model_package/code/inference.py', arcname='code/inference.py')

s3 = boto3.client('s3', region_name='ap-southeast-1')
s3.upload_file('model.tar.gz', BUCKET_NAME, f'{PREFIX}/models/artifacts/xgboost_model_with_code.tar.gz')
print("Model uploaded to S3 ✅")
```

### SHAP Feature Importance

```bash
python week5_registry/shap_analysis.py
```

```python
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_val[:1000])
shap.summary_plot(shap_values, X_val[:1000], show=False)
plt.savefig('plots/shap_summary.png', bbox_inches='tight')
```

**Top 5 features by SHAP importance:**

| Rank | Feature | Importance |
|------|---------|-----------|
| 1 | `rolling_mean_14` | Very High |
| 2 | `Promo` | Very High |
| 3 | `rolling_mean_30` | High |
| 4 | `DayOfWeek` | Medium |
| 5 | `lag_7` | Medium |

### Expected Results

```
Validation RMSE: 941.21
Validation MAPE: 9.92%

Test RMSE: 925.28
Test MAPE: 9.92%

Model artifact: models/xgboost_model.pkl (saved locally)
S3 artifact:    s3://your-bucket/ml-forecasting/models/artifacts/xgboost_model_with_code.tar.gz
```
