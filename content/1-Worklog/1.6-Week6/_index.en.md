---
title: "Week 6 — Deployment + REST API"
date: 2026-07-11
weight: 6
chapter: false
pre: "<b>1.6. </b>"
---

## Week 6 — Deployment + REST API ✅

**Owner:** Van Thai Quan | **Period:** 11/07/2026 – 17/07/2026

---

### Context
Team account (119505195050) has SageMaker Endpoint quota = 0. Van Thai Quan used his personal AWS account (897355252080) with independent infrastructure to complete deployment.

### Tasks Completed

1. **Independent AWS Infrastructure Setup (personal account)**
   - New S3 Bucket: `quanvan-ml-forecasting-2026`
   - New IAM Role: `SageMaker-ExecutionRole-QuanVan` with custom inline policy
   - Re-ran preprocessing and training to generate artifacts in new account

2. **Deployed SageMaker Endpoint**
   - Used pure boto3 — no SageMaker SDK (SDK 3.x broken)
   - Packaged model: `xgboost_model.pkl` + `inference.py` → `model.tar.gz`
   - Instance type: `ml.t2.medium`

3. **Debugged 3 Real Errors**

| Error | Root Cause | Fix |
|-------|-----------|-----|
| ValidationException | Wrong container image URI for region | Get correct URI via `sagemaker.image_uris.retrieve()` |
| ModelError 500 | XGBoost version mismatch train vs serve | Downgrade to 1.7.6, retrain |
| Infinity result | Extra `np.expm1()` in inference.py | Remove line, return `model.predict(X)` directly |

4. **Built Lambda + API Gateway**
   - `lambda_function.py`: receive request → call Endpoint → return response
   - `deploy_lambda.py`: IaC script for automated Lambda deployment
   - API Gateway: REST API, `/forecast` POST, Lambda Proxy integration, `prod` stage

5. **Validated with Real Historical Data**
   - `build_real_features.py`: compute 22 features from real history (no leakage)
   - MAPE_THRESHOLD = 15% as automatic quality gate

---

### Results

| Item | Result |
|------|--------|
| SageMaker Endpoint | InService — ml.t2.medium (366.6s) ✅ |
| Smoke test (boto3) | `predicted_sales: 5301.91` ✅ |
| Real data validation | Store 1, 2015-06-15: **5.14% error** ✅ |
| Lambda function | statusCode 200, Duration ~2.4s ✅ |
| REST API (curl) | `{"predicted_sales": [5301.91]}` ✅ |
| Cleanup | Endpoint, Config, Model deleted ✅ |

**API Endpoint:**
```
https://81nxjqyb91.execute-api.ap-southeast-1.amazonaws.com/prod/forecast
```

**Demo:**
```bash
curl -X POST https://81nxjqyb91.execute-api.ap-southeast-1.amazonaws.com/prod/forecast \
  -H "Content-Type: application/json" \
  -d '{"Store": 1, "DayOfWeek": 3, "Promo": 1, "CompetitionDistance": 1270}'

# Response:
{"predicted_sales": [5301.91]}
```

**Architecture:**
```
Client (curl / app)
      │
      ▼
API Gateway (REST, /forecast POST, stage: prod)
      │
      ▼
Lambda (rossmann-forecast-api)
      │
      ▼
SageMaker Endpoint (rossmann-forecasting-endpoint)
  Container: sagemaker-xgboost:1.7-1
  Model: xgboost_model.pkl + inference.py
```

---

### Lessons Learned
- Always use `sagemaker.image_uris.retrieve()` to get region-correct container URIs
- Pin XGBoost version and match between training and serving environments
- Never use `np.expm1()` if the target was not log-transformed during training
- IaC for Lambda deployment (`deploy_lambda.py`) saves time and is repeatable
