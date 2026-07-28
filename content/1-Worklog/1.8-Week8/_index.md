---
title: "Week 8 — Pipeline + Refactor"
date: 2026-07-25
weight: 8
chapter: false
pre: "<b>1.8. </b>"
---

## Week 8 — Pipeline + Refactor ✅

**Owner:** Van Thai Quan | **Period:** 25/07/2026 – 31/07/2026

---

### Context
Goal: automate the entire ML pipeline end-to-end. Obstacle: Training Jobs quota = 0 on both team and personal accounts. Dual solution: create Pipeline definition on AWS (IaC) + run Local Orchestration as Proof of Concept.

### Tasks Completed

1. **Wrote `pipeline_definition.py`**
   - Defined Pipeline JSON per AWS standard with 3 steps:
     - **Step 1 — Processing:** runs `preprocessing.py` on `ml.t3.medium`
     - **Step 2 — Training:** trains XGBoost on `ml.m5.large`
     - **Step 3 — Condition:** registers model only if RMSE ≤ 1000
   - Used pure boto3, no SageMaker SDK

2. **Created SageMaker Pipeline on AWS**
   ```
   Pipeline ARN:
   arn:aws:sagemaker:ap-southeast-1:897355252080:pipeline/Rossmann-Sales-Pipeline-20260723222102
   ```
   > Pipeline is 100% production-ready — waiting for AWS quota increase to execute

3. **Wrote and Ran `simple_orchestration.py`** (Local PoC)
   - Replaces real SageMaker Pipelines when quota = 0
   - 5 sequential steps with quality gates:
     1. Preprocessing
     2. Training XGBoost
     3. Deploy Endpoint
     4. Smoke Test Endpoint
     5. Validate Model Accuracy (MAPE threshold 15%)
   - Auto cleanup after completion

4. **Refactored Codebase to `src/` Structure**
   - `src/data/` — preprocessing.py, dataset.py
   - `src/models/` — xgboost_trainer.py, lstm_model.py, lstm_trainer.py
   - `src/serving/` — inference.py, lambda_function.py
   - `monitoring/` — drift_simulator.py

---

### Results

**Local Orchestration (Proof of Concept):**

| Step | Time | Result |
|------|------|--------|
| Preprocessing | 8.2s | 785,727 rows ✅ |
| Training XGBoost | 147.1s | RMSE 929.83, MAPE 9.81% ✅ |
| Deploy Endpoint | 426.4s | InService ✅ |
| Smoke Test | 2.4s | predicted_sales: 5301.91 ✅ |
| Validate Accuracy | 3.9s | 5.14% error < 15% ✅ PASS |
| **Total** | **587.9s** | **✅ Complete** |

**Cleanup:**
```
✅ Deleted Endpoint: rossmann-forecasting-endpoint
✅ Deleted Endpoint Config: rossmann-config-1784874810
✅ Deleted Model: rossmann-xgboost-1784874810
```

**Orchestration Flow:**
```
Preprocessing
      │
      ▼
Training XGBoost
      │
      ▼
Deploy Endpoint
      │
      ▼
Smoke Test ──── fail? ──→ stop, report error
      │ pass
      ▼
Validate Accuracy ──── MAPE > 15%? ──→ stop, report error
      │ pass
      ▼
✅ Complete → Auto Cleanup
```

---

### Lessons Learned
- Pipeline IaC (boto3) is ready for production — quota is the only blocker
- Local orchestration PoC proves the logic works end-to-end without cloud costs
- Always include quality gates (MAPE threshold) in orchestration to prevent bad models from deploying
- Cleanup immediately after demo — SageMaker Endpoints charge by the hour
