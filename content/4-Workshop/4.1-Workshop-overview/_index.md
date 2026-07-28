---
title: "1. Workshop Overview"
date: 2026-06-06
weight: 1
chapter: false
pre: "<b>4.1. </b>"
---

## Workshop Overview

### Project Background

**Rossmann Store Sales** is one of Kaggle's most popular retail forecasting competitions. The dataset contains:
- **1,017,209** daily sales records
- **1,115** stores across Germany
- **942** days of history (January 2013 – July 2015)
- Features: promotions, competition distance, store type, assortment, holidays

### The Business Problem

Retail chains need accurate daily sales forecasts to:

| Challenge | Without Forecasting | With ML Forecasting |
|-----------|-------------------|-------------------|
| Inventory | Stockouts or waste | Optimal stock levels |
| Staffing | Over/understaffed | Right people, right time |
| Marketing | Poorly timed promos | Data-driven campaign timing |
| Finance | Budget surprises | Predictable revenue |

### Solution Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
│  Rossmann CSV → Amazon S3 (raw + processed)             │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    ML LAYER                             │
│  Feature Engineering → XGBoost Training (local)        │
│  22 features: rolling_mean, lag, promo, date...         │
│  Result: RMSE 925.28, MAPE 9.92%                       │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                   SERVING LAYER                         │
│  SageMaker Endpoint (ml.t2.medium)                      │
│  → AWS Lambda → API Gateway REST API                    │
│  → Public endpoint: /forecast POST                      │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                 MONITORING LAYER                        │
│  Custom drift detection (z-score)                       │
│  CloudWatch Dashboard: RossmannForecastingDashboard     │
└─────────────────────────────────────────────────────────┘
```

### Key Technical Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Primary model | XGBoost | Outperformed LSTM (RMSE 925 vs 3,044) |
| ML framework | boto3 (not SageMaker SDK) | SDK 3.x was broken |
| Training location | Local machine | SageMaker Training quota = 0 |
| Model packaging | `model.tar.gz` with inference.py | SageMaker SKLearn container format |
| Drift detection | Z-score statistical test | No real new data available |

### Actual Results

```
Model:            XGBoost (1.7.6)
Test RMSE:        925.28
Test MAPE:        9.92%
API Accuracy:     5.14% error on real data (Store 1, 2015-06-15)
API Latency:      ~1.1 seconds
Endpoint cost:    ~$0.05/hour (ml.t2.medium)
```

### Workarounds Applied During the Internship

{{% notice warning %}}
The team encountered several AWS service quota limitations. The following workarounds were applied — understanding these is part of the learning value.
{{% /notice %}}

| Service Blocked | Workaround | Week |
|----------------|-----------|------|
| SageMaker Training Jobs (quota=0) | Train locally, log metrics via boto3 | 3–4 |
| SageMaker Model Registry (quota=0) | Save metadata JSON to S3 | 5 |
| SageMaker SDK 3.x broken | Use `boto3.client()` directly | All |
| SageMaker Endpoint (quota=0 on team account) | Use personal account | 6 |
| SageMaker Pipelines (quota=0) | Local orchestration script | 8 |