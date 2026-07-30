---
title: "Week 5 — Model Registry & SHAP Analysis"
date: 2026-07-04
weight: 5
chapter: false
pre: "<b>1.5. </b>"
---

# Week 5 — S3 Model Registry Implementation & SHAP Model Explainability

**Owner:** Huynh Kim Quy (Data & Machine Learning Engineer)  
**Period:** 04/07/2026 – 10/07/2026  
**Primary Objective:** Build an S3 JSON-based Model Registry workaround for model version control, implement feature importance explainability using SHAP TreeExplainer, and author the production `inference.py` script for SageMaker endpoint serving.

---

## 1. Technical Implementation Details

### 1.1. S3 Model Registry Workaround Architecture
Facing AWS SageMaker Model Registry Quota limits (= 0) on the test account, the team designed a flexible **S3 Metadata Registry Architecture**:
- Upon training completion, model artifacts (`xgboost_model.tar.gz`) were uploaded to `s3://aws-internship-hkq-2026/ml-forecasting/models/artifacts/`.
- A JSON metadata schema containing model versioning (`v1.0`), hyperparameters, test metrics (RMSE 925.28, MAPE 9.92%), and approval status (`Approved`) was logged at `s3://aws-internship-hkq-2026/ml-forecasting/models/registry/v1.0_metadata.json`.

| Registered Model | Version | Test RMSE | Test MAPE | Approval Status | S3 Artifact Location |
|------------------|---------|-----------|-----------|-----------------|----------------------|
| **XGBoost-Baseline** ⭐ | `v1.0` | **925.28** | **9.92%** | **Approved ✅** | `s3://.../xgboost_model.tar.gz` |
| PyTorch-LSTM | `v0.1-exp` | 3,044.43 | 32.79% | Rejected ❌ | `s3://.../lstm_model.tar.gz` |

### 1.2. Feature Importance Analysis via SHAP TreeExplainer (`shap_analysis.py`)
To explain individual store sales predictions, the team integrated **SHAP (SHapley Additive exPlanations)** using `shap.TreeExplainer`:

| Rank | Feature Name | Business Context | SHAP Importance Rating |
|------|--------------|------------------|------------------------|
| 1 | `rolling_mean_14` | 14-day rolling sales average | ⭐⭐⭐⭐⭐ (Primary trend indicator) |
| 2 | `Promo` | Active promotion campaign flag | ⭐⭐⭐⭐⭐ (Immediate sales spike impact) |
| 3 | `rolling_mean_30` | 30-day (monthly) rolling average | ⭐⭐⭐⭐ (Monthly sales baseline) |
| 4 | `DayOfWeek` | Day of week (Mon - Sun) | ⭐⭐⭐ (Weekend purchasing seasonality) |
| 5 | `sales_lag_7` | Same day previous week sales | ⭐⭐⭐ (Weekly cycle correlation) |

> **Business Insight:** SHAP analysis validated domain intuition: **Active Promotions (`Promo`)** and **Recent 2-Week Demand Trends (`rolling_mean_14`)** are the two dominant drivers influencing store sales volume.

---

## 2. Technical Code Snippets

### 2.1. Model Registry JSON Metadata Logger (`model_registry.py`)
```python
import json
import boto3

s3_client = boto3.client('s3', region_name='ap-southeast-1')
BUCKET = 'aws-internship-hkq-2026'

# Define standardized JSON metadata schema
metadata = {
    "ModelName": "rossmann-xgboost-model",
    "ModelVersion": "v1.0",
    "Framework": "XGBoost 1.7.6",
    "TestMetrics": {
        "RMSE": 925.28,
        "MAPE": 9.92
    },
    "ApprovalStatus": "Approved",
    "ArtifactLocation": f"s3://{BUCKET}/ml-forecasting/models/artifacts/xgboost_model.tar.gz",
    "CreatedBy": "Huynh Kim Quy",
    "Timestamp": "2026-07-08T10:30:00Z"
}

# Upload to S3 Registry
s3_client.put_object(
    Bucket=BUCKET,
    Key='ml-forecasting/models/registry/v1.0_metadata.json',
    Body=json.dumps(metadata, indent=2)
)
print("✅ Successfully Registered Model Metadata to S3 Registry!")
```

### 2.2. Production Inference Handler (`inference.py`)
```python
import os
import json
import pickle
import numpy as np

def model_fn(model_dir):
    """Load model artifact inside SageMaker Serving Container."""
    model_path = os.path.join(model_dir, "xgboost_model.pkl")
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    return model

def predict_fn(input_data, model):
    """Execute prediction on incoming JSON payloads from AWS Lambda."""
    # input_data is a numpy array containing 22 features
    predictions = model.predict(input_data)
    # Return non-negative predicted sales volume
    return np.maximum(0, predictions).tolist()
```

---

## 3. Key Lessons Learned

1. **Cloud Architecture Flexibility:** Designing a custom JSON metadata registry on S3 provided full versioning control when official SageMaker Model Registry quotas were restricted.
2. **Model Transparency:** SHAP explainability confirmed model fairness and significantly enhanced stakeholder trust in AI predictions.
3. **Decoupling Training and Inference:** Writing an independent `inference.py` script in Week 5 streamlined SageMaker endpoint container packaging in subsequent weeks.
