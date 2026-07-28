---
title: "Week 5 — Model Registry + SHAP Analysis"
date: 2026-07-04
weight: 5
chapter: false
pre: "<b>1.5. </b>"
---

## Week 5 — Model Registry + SHAP Analysis ✅

**Owner:** Huynh Kim Quy | **Period:** 04/07/2026 – 10/07/2026

---

### Tasks Completed

1. **Model Registry (S3/JSON workaround)**
   - SageMaker Model Registry quota = 0 → stored metadata as JSON in S3
   - Registered both models with version, metrics, and approval status

   | Model | RMSE | MAPE | Status |
   |-------|------|------|--------|
   | XGBoost-Baseline | 925.28 | 9.92% | Approved ✅ |
   | LSTM-Forecaster | 3,044.43 | 32.79% | Approved ✅ |

2. **SHAP Feature Importance Analysis**
   - Used `shap.TreeExplainer` on XGBoost model
   - Generated `shap_importance.png` and `shap_summary.png`
   - Uploaded plots to S3

3. **Top Features by SHAP**

   | Rank | Feature | Importance |
   |------|---------|-----------|
   | 1 | rolling_mean_14 | ⭐⭐⭐⭐⭐ |
   | 2 | Promo | ⭐⭐⭐⭐⭐ |
   | 3 | rolling_mean_30 | ⭐⭐⭐⭐ |
   | 4 | DayOfWeek | ⭐⭐⭐ |
   | 5 | lag_7 | ⭐⭐⭐ |

4. **Wrote `inference.py` (Production version)**
   - Input: raw feature dict
   - Process: feature validation → predict → return sales value
   - No `np.expm1()` — model trained directly on raw Sales values

---

### Lessons Learned
- SHAP values confirm business intuition: promotions and recent sales history are the most predictive
- Always write a dedicated `inference.py` separated from training code — this file goes into the SageMaker container
- Store model metadata in S3 JSON when registry quota is unavailable — pragmatic workaround
