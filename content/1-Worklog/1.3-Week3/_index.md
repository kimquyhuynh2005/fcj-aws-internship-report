---
title: "Week 3 — XGBoost Baseline + LSTM Skeleton"
date: 2026-06-20
weight: 3
chapter: false
pre: "<b>1.3. </b>"
---

## Week 3 — XGBoost Baseline + LSTM Skeleton ✅

**Owner:** Huynh Kim Quy | **Period:** 20/06/2026 – 26/06/2026

---

### Tasks Completed

1. **XGBoost Baseline Training**
   - Trained locally using XGBoost 1.7.6 with hyperparameters: `n_estimators=500, max_depth=6, learning_rate=0.05`
   - Logged experiment to SageMaker Experiments via boto3
   - Uploaded model artifact to S3

2. **XGBoost Results**

| Metric | Validation | Test |
|--------|-----------|------|
| RMSE | 941.21 | **925.28** |
| MAPE | 9.92% | **9.92%** |

3. **LSTM Skeleton**
   - Created `model.py` — PyTorch LSTM architecture
   - Created `dataset.py` — TimeSeriesDataset class
   - Unit test passed: forward pass, shape check

4. **SageMaker Experiments Logging (boto3 workaround)**
   `python
   sm_client = boto3.client('sagemaker', region_name='ap-southeast-1')
   # Log metrics directly since SageMaker SDK 3.x was broken
   sm_client.batch_put_metrics(...)
   `

---

### Lessons Learned
- XGBoost with 22 hand-crafted features significantly outperforms expectations
- SageMaker SDK 3.x broken → use `boto3.client()` directly (more stable)
- Always pin XGBoost version — version mismatch between train/serve is a real problem
