---
title: "Blog 1: XGBoost vs. PyTorch LSTM for Time Series Forecasting"
date: 2026-06-06
weight: 1
chapter: false
pre: "<b>3.1. </b>"
---

> **Author:** Huynh Kim Quy  
> **Category:** Machine Learning Engineering / Time Series Forecasting  
> **Community:** AWS Study Group  
> **Project:** E-commerce Sales Forecasting on AWS SageMaker  
> 🔗 **Facebook Post:** [View Post on Facebook Group](https://www.facebook.com/groups/660548818043427/?multi_permalinks=2229917637773196&ref=share)

---

## 1. Introduction and Common Misconceptions

In Machine Learning and Data Science, a common assumption is that time-series forecasting tasks always require Deep Learning architectures such as LSTM, GRU, or Transformers to achieve optimal performance.

However, during the implementation of the Rossmann retail sales forecasting system (comprising 1,017,209 records across 1,115 stores), empirical results demonstrated that a decision tree-based XGBoost model significantly outperformed a PyTorch LSTM architecture in accuracy, training efficiency, and computational resource consumption.

This article presents the empirical results and analyzes the technical rationale behind these findings.

---

## 2. Empirical Results Comparison

Experiments were conducted on identical Train, Validation, and Test datasets split chronologically to prevent future data leakage.

| Evaluation Metric | XGBoost Regressor (Baseline) | PyTorch LSTM (Deep Learning) | Relative Performance |
|---|---|---|---|
| Test RMSE (Lower is better) | **925.28** | 3,044.43 | XGBoost is 3.29x better |
| Test MAPE (Lower is better) | **9.92%** | 32.79% | XGBoost is 3.30x better |
| Training Time (CPU) | **~45 seconds** | ~8 minutes (50 epochs) | XGBoost is 10.6x faster |
| Model Artifact Size | **~1.2 MB** | ~4.8 MB | XGBoost is 4.0x smaller |
| Inference Latency | **~12 ms** | ~85 ms | XGBoost is faster |
| AWS Deployment Status | **Selected for Production** | Experimental Model | — |

![Model Performance Comparison Chart - RMSE and MAPE](/images/3-BlogsPosted/model_comparison.png)

---

## 3. Technical Analysis

### 3.1. Tabular Data Structure
The Rossmann dataset is multidimensional tabular data combining categorical variables (`StoreType`, `Assortment`, `StateHoliday`), binary event flags (`Promo`, `SchoolHoliday`), and continuous features (`CompetitionDistance`).

Tree-based algorithms excel at feature space partitioning on mixed tabular data types. Conversely, LSTM networks process features by continuously propagating states through non-linear activation functions (Tanh/Sigmoid), which diminishes decision boundary clarity on categorical inputs.

### 3.2. Role of Feature Engineering
Rather than relying on sequence learning from raw inputs, 22 domain features were engineered:
- **Rolling Means:** `rolling_mean_7`, `rolling_mean_14`, `rolling_mean_30`.
- **Lag Features:** `lag_1`, `lag_7`, `lag_14`.
- **Calendar Features:** `DayOfWeek`, `Month`, `WeekOfYear`, `IsWeekend`, `IsDecember`.

These features transformed time-series forecasting into a Supervised Regression problem, allowing XGBoost to leverage rolling statistics effectively.

### 3.3. Robustness to Scale and Outliers
LSTM networks are sensitive to input scaling. During peak sales periods (such as December), gradients are prone to exploding or vanishing. XGBoost is monotonically invariant and robust against scale anomalies due to rank-based histogram splitting.

### 3.4. Computational Efficiency and Cloud Cost
Training XGBoost with `tree_method='hist'` completed in 45 seconds on a standard CPU instance (`ml.t3.medium`). In contrast, a 2-layer LSTM required 8 minutes without reaching full convergence. On AWS Cloud, selecting XGBoost reduced training instance costs by over 90%.

---

## 4. Feature Importance Analysis via SHAP Values

SHAP (SHapley Additive exPlanations) was used to evaluate feature contributions to the XGBoost predictions:

```python
import shap
import pickle

with open('models/xgboost_model.pkl', 'rb') as f:
    model = pickle.load(f)

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test.sample(1000, random_state=42))
```

![SHAP Summary Plot evaluating feature contributions to sales predictions](/images/3-BlogsPosted/shap_summary.png)

![SHAP Feature Importance Ranking](/images/3-BlogsPosted/shap_importance.png)

Top feature contributions:
1. `rolling_mean_14`: The 14-day rolling average serves as the primary short-term indicator.
2. `Promo`: Promotions increase average store sales by 37%.
3. `rolling_mean_30` and `DayOfWeek`: Establish baseline demand and weekly consumption cycles.

---

## 5. Conclusion

1. **Baseline Evaluation:** A tree-based model baseline (XGBoost/LightGBM) with engineered features should be established prior to testing neural network architectures.
2. **Tabular Data Performance:** For tabular datasets under several million records, tree-based models maintain superior accuracy and computational efficiency.
3. **Production Selection Criteria:** Production models must optimize accuracy, infrastructure costs, and inference latency simultaneously.
