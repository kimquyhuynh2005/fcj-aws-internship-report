---
title: "Blog 1: XGBoost vs. PyTorch LSTM for Time Series Forecasting"
date: 2026-06-06
weight: 1
chapter: false
pre: "<b>3.1. </b>"
---

# Blog 1: XGBoost vs. PyTorch LSTM for Time Series Sales Forecasting

> **Author:** Huynh Kim Quy  
> **Category:** Machine Learning Engineering / Time Series Forecasting  
> **Published at:** AWS Study Group Community  
> **Project:** E-commerce Sales Forecasting on AWS SageMaker

---

## 📌 1. Introduction: The "Deep Learning is Always Superior" Myth

In the Machine Learning & Data Science community, there is a widespread misconception: **"Any time-series forecasting problem should automatically use Deep Learning models like LSTM, GRU, or Transformers to achieve peak accuracy."**

However, when building our **Rossmann Retail Sales Forecasting System** (a dataset comprising **1,017,209 records** across **1,115 stores**), our team discovered the exact opposite: **The traditional XGBoost model outperformed PyTorch LSTM with 3x higher accuracy and 10x faster training speed.**

This blog post dives deep into empirical metrics and analyzes the 4 technical reasons behind this result.

---

## 📊 2. Empirical Results Comparison Table

We conducted parallel experiments on the exact same Train/Validation/Test data split chronologically (preventing future data leakage):

| Evaluation Criteria | XGBoost Regressor (Baseline) ⭐ | PyTorch LSTM (Deep Learning) | Difference |
|---|---|---|---|
| **Test RMSE (Lower is better)** | **925.28** | **3,044.43** | XGBoost **3.29x better** |
| **Test MAPE (Lower is better)** | **9.92%** | **32.79%** | XGBoost **3.30x better** |
| **Training Time (CPU)** | **~45 seconds** | **~8 minutes** (50 epochs) | XGBoost **10.6x faster** |
| **Model Artifact Size** | **~1.2 MB** | **~4.8 MB** | XGBoost **4x smaller** |
| **Inference Latency** | **~12 ms** | **~85 ms** | XGBoost responds faster |
| **AWS Deployment Status** | ✅ **Selected for Production** | ❌ Experimental Model | — |

---

## 🔍 3. Unpacking 4 Technical Reasons Why XGBoost Won

```text
┌────────────────────────────────────────────────────────────────────────┐
│                     WHY DID XGBOOST OUTPERFORM LSTM?                   │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Tabular Data Nature: Tree decision splits handle tabular data better│
│ 2. Feature Engineering: 22 Lag/Rolling features encapsulated time      │
│ 3. Outlier Invariance: Robust against scale transformations            │
│ 4. Compute Efficiency: Tree algorithms execute faster than RNN matrices│
└────────────────────────────────────────────────────────────────────────┘
```

### 🔹 Reason 1: Tabular Data Nature
The Rossmann store dataset is multidimensional tabular data combining:
- **Categorical Variables:** `StoreType` (Store type A/B/C/D), `Assortment`, `StateHoliday`, `Promo2`.
- **Binary Flags:** `Promo`, `SchoolHoliday`.
- **Continuous Features:** `CompetitionDistance`.

Tree-based models like XGBoost partition feature spaces across mixed tabular types effortlessly. In contrast, LSTMs pass categorical features through continuous activation functions (Tanh/Sigmoid), distorting boundary decision splits.

---

### 🔹 Reason 2: Power of Feature Engineering (Lag & Rolling Features)
Instead of forcing the model to learn raw temporal sequences from scratch, we engineered **22 domain features**:
- **Rolling Means:** `rolling_mean_7`, `rolling_mean_14`, `rolling_mean_30`.
- **Lag Features:** `lag_1`, `lag_7` (yesterday's sales, same day last week).
- **Calendar Features:** `DayOfWeek`, `Month`, `WeekOfYear`, `IsWeekend`, `IsDecember`.

Engineered features transformed complex sequence forecasting into a **Supervised Regression problem**, where Gradient Boosting excels at tree-splitting on rolling statistics.

---

### 🔹 Reason 3: Scale Sensitivity & Outlier Robustness
- **LSTM:** Highly sensitive to feature scaling. December holiday sales spikes frequently cause exploding/vanishing gradients.
- **XGBoost:** Monotonically invariant and robust to scale anomalies due to rank-based histogram splitting.

---

### 🔹 Reason 4: Compute Efficiency & Cloud Cost Optimization
- Training XGBoost with `tree_method='hist'` took only **45 seconds** on a standard CPU (`ml.t3.medium`).
- Training 2-layer LSTM took **8 minutes** on CPU without reaching full convergence at epoch 50.
- On AWS Cloud, choosing XGBoost reduced **training instance costs by over 90%**.

---

## 💡 4. SHAP Value Importance & Engineering Insights

Using **SHAP (SHapley Additive exPlanations)**, we verified model explainability:

```python
import shap
import pickle

with open('models/xgboost_model.pkl', 'rb') as f:
    model = pickle.load(f)

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test.sample(1000))
```

**Top Feature Importance Ranking:**
1. **`rolling_mean_14` (Highest impact):** 14-day rolling sales average is the strongest short-term indicator.
2. **`Promo` (Second highest):** Promotions increase average store sales by **~37%**.
3. **`rolling_mean_30` & `DayOfWeek`:** Establish baseline demand and weekend shopping cycles.

---

## 🏁 5. Conclusion & Recommendations

1. **Never Underestimate Simple Baselines:** Always start with a well-engineered Gradient Boosting baseline (XGBoost / LightGBM) before jumping into deep neural networks.
2. **Tabular Data Belongs to Trees:** For tabular datasets under millions of rows, tree-based models remain the gold standard for accuracy and operational cost.
3. **Production-First Mindset:** The best model is not the most complex one, but the one delivering **highest accuracy with lowest latency and compute cost**.
