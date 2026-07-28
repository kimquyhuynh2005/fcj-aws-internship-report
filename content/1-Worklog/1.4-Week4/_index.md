---
title: "Week 4 — Train PyTorch LSTM"
date: 2026-06-27
weight: 4
chapter: false
pre: "<b>1.4. </b>"
---

## Week 4 — Train PyTorch LSTM ✅

**Owner:** Huynh Kim Quy | **Period:** 27/06/2026 – 03/07/2026

---

### Tasks Completed

1. **PyTorch LSTM Training**
   - Architecture: 2-layer LSTM, hidden_size=128, dropout=0.2
   - Trained on CPU for 50 epochs (insufficient for convergence)
   - Saved best model to `week4_lstm/models/lstm_best.pt`
   - Uploaded to S3

2. **Model Comparison**

| Model | Test RMSE | Test MAPE | Decision |
|-------|----------|----------|---------|
| **XGBoost** ⭐ | **925.28** | **9.92%** | ✅ Production |
| LSTM | 3,044.43 | 32.79% | ❌ Experiment only |

3. **Root Cause Analysis — Why LSTM Underperformed**
   - Features not normalized → LSTM is sensitive to input scale
   - Sequence length = 7 is too short for capturing seasonal patterns
   - Missing lag features (compared to XGBoost's 22 engineered features)
   - Trained on CPU — insufficient epochs for convergence

4. **Decision**
   > **XGBoost selected as the production model.** LSTM underperformance is documented as a learning outcome, not a failure — tabular time series with moderate dataset size often favors gradient boosting over deep learning.

---

### Lessons Learned
- For tabular time series with <1M rows, XGBoost/LightGBM typically beats LSTM
- LSTM requires careful input normalization and longer sequences to capture seasonality
- Comparing models explicitly adds credibility to the final selection
