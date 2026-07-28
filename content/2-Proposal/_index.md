---
title: "Proposal"
date: 2026-06-06
weight: 2
chapter: false
pre: "<b>2. </b>"
---

# Project Proposal: E-commerce Sales Forecasting on AWS

## 1. Project Overview

This project builds a complete **end-to-end Machine Learning system** on AWS to solve the daily sales forecasting problem for a retail chain. The system covers the entire ML lifecycle: data ingestion, preprocessing, model training, deployment, monitoring, and pipeline automation.

**Dataset:** Rossmann Store Sales (Kaggle) — 1,017,209 records, 1,115 stores, 942 days (2013–2015)

---

## 2. Objectives

### Technical Objectives
- Build and compare two forecasting models: **XGBoost** (baseline) and **PyTorch LSTM**
- Deploy the best model to SageMaker Endpoint and expose via public REST API
- Set up automated data drift monitoring using CloudWatch
- Automate the full workflow with SageMaker Pipelines (IaC)

### Learning Objectives
- Master the AWS ML ecosystem: SageMaker, S3, Lambda, API Gateway, CloudWatch
- Apply ML engineering best practices: versioning, experiment tracking, model registry
- Understand the difference between local model training and production cloud ML systems

---

## 3. Problem Statement

### The Business Problem
Forecast daily sales for 1,115 retail stores based on historical data, promotions, holidays, and external factors. This is a **time series regression** problem.

### Why This Matters
| Business Issue | Impact Without Forecasting |
|---------------|--------------------------|
| Inventory | Stockouts or overstocking → wasted cost |
| Staffing | Poor scheduling → higher operating costs |
| Marketing | Wrong timing for campaigns → low ROI |
| Anomaly detection | Undetected revenue trends → lost income |

---

## 4. Solution Architecture

![Detailed AWS System Architecture Diagram](/images/2-Proposal/aws_architecture.png)

```
Raw Data (Rossmann CSV) → Amazon S3
         │
         ▼
SageMaker Processing Job
(Feature Engineering: rolling_mean, lag features, date features)
         │
    ┌────┴────┐
    ▼         ▼
XGBoost    PyTorch LSTM
Training   Training
    │         │
    └────┬────┘
         ▼
SageMaker Experiments (compare RMSE, MAPE)
         │
         ▼
SageMaker Model Registry (versioning + approval)
         │
         ▼
SageMaker Endpoint (ml.t2.medium, real-time inference)
         │
         ▼
AWS Lambda + API Gateway (public REST API)
         │
         ▼
Custom Drift Monitor + CloudWatch Dashboard
         │
         ▼
SageMaker Pipelines (end-to-end automation)
```

### AWS Services Used

| Service | Purpose |
|---------|---------|
| Amazon S3 | Data storage, model artifacts, logs |
| AWS IAM | Least privilege roles and policies |
| SageMaker Experiments | Experiment tracking and comparison |
| SageMaker Endpoint | Real-time inference (ml.t2.medium) |
| AWS Lambda | Serverless inference wrapper |
| Amazon API Gateway | Expose public REST API |
| Amazon CloudWatch | Metrics, logs, alerts, dashboard |
| SageMaker Pipelines | End-to-end workflow automation |

---

## 5. Timeline

| Week | Goal | Deliverable |
|------|------|------------|
| **1** | AWS environment setup | IAM Role, S3 bucket, config.py ✅ |
| **2** | Data preprocessing & EDA | Processed data on S3, train/val/test split ✅ |
| **3** | XGBoost baseline + LSTM skeleton | XGBoost artifact, RMSE 925.28, MAPE 9.92% ✅ |
| **4** | Train PyTorch LSTM | LSTM artifact, comparison vs XGBoost ✅ |
| **5** | Model Registry + SHAP | Models registered, SHAP feature importance plots ✅ |
| **6** | Deployment + REST API | REST API live, sai lệch 5.14% ✅ |
| **7** | Monitoring + Drift Detection | CloudWatch Dashboard, drift detected ✅ |
| **8** | Pipeline + Refactor | SageMaker Pipeline IaC, local orchestration ✅ |
| **9–12** | Documentation & Report | This website & AWS Architecture Packaging ✅ |

![Overall Final AWS Architecture Diagram (Weeks 9-12)](/images/2-Proposal/aws_architecture.png)

---

## 6. Team Roles

| Role | Responsibility |
|------|--------------|
| **A — Data/ML** (Huynh Kim Quy) | Data pipeline, XGBoost & LSTM code, SHAP analysis |
| **B — Infra/AWS** (Van Thai Quan) | Deployment, SageMaker Endpoint, Pipeline IaC |
| **C — Backend/API** (Nguyen Ngoc Sang) | Lambda, API Gateway, CloudWatch monitoring |

---

## 7. Expected vs Actual Results

| Model | Target MAPE | Actual MAPE | Target RMSE | Actual RMSE |
|-------|------------|-------------|------------|-------------|
| **XGBoost** | ~15% | **9.92%** ✅ | ~1,200 | **925.28** ✅ |
| LSTM | ~12% | 32.79% ❌ | ~1,000 | 3,044.43 ❌ |

> **Conclusion:** XGBoost significantly outperformed expectations. LSTM underperformed due to insufficient normalization and sequence length — a valuable learning outcome.

---

## 8. Budget Estimation

| Service | Usage | Estimated Cost |
|---------|-------|---------------|
| SageMaker Endpoint | ~2 weeks, ml.t2.medium | ~$2 |
| S3 Storage | ~5 GB | ~$0.10 |
| Lambda + API Gateway | Within free tier | $0 |
| **Total** | | **~$2–5** |

> Note: SageMaker Training Jobs quota was 0 on the team account. Training was performed locally, drastically reducing cloud costs.

---

## 9. Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| SageMaker quota = 0 | **Happened** | Train locally, use personal account for deployment |
| LSTM worse than XGBoost | Happened | Reframe as comparison study — still valuable |
| Data leakage in preprocessing | Low | Fit scaler only on train set, chronological split |
| XGBoost version conflict | Happened | Pin to version 1.7.6, match train and serve |
| No new data for monitoring | Certain | Write `drift_simulator.py` to simulate drift |