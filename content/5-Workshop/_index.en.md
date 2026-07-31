---
title: "Workshop"
date: 2026-06-06
weight: 5
chapter: false
pre: "<b>5. </b>"
---

# Workshop: E-commerce Sales Forecasting Pipeline on AWS

## Overview

This technical documentation section presents the **complete end-to-end Machine Learning pipeline** built on AWS by our internship team to forecast daily retail sales. The entire solution is documented directly from our team's production implementation during the AWS First Cloud AI Journey internship.

{{% notice info %}}
**Real Project:** This workshop details the actual engineering work performed by our team during the 8-week AWS internship. All code, evaluation metrics, and configurations are from our team's live deployment—not a theoretical tutorial demo.
{{% /notice %}}

## Implemented System Architecture

```
Raw Data (S3)
     │
     ▼
Data Preprocessing & Feature Engineering
     │
     ▼
XGBoost Model Training (local, with SageMaker Experiments logging)
     │
     ▼
SageMaker Endpoint Deployment (ml.t2.medium)
     │
     ▼
AWS Lambda + API Gateway (public REST API)
     │
     ▼
CloudWatch Monitoring + Drift Detection
```

## AWS Services Utilized

| Service | Implementation Purpose |
|---------|------------------------|
| Amazon S3 | Raw dataset storage and model artifacts repository |
| AWS IAM | Least-privilege security role policies |
| Amazon SageMaker | Real-time model inference endpoint hosting |
| AWS Lambda | Serverless inference middleware logic |
| Amazon API Gateway | Public REST API endpoint provisioning |
| Amazon CloudWatch | System health monitoring and data drift alerts |

## Technical Achievements

This workshop documents the systematic steps executed by our team:
- Preprocessed time-series data and engineered temporal lag/rolling features
- Trained XGBoost model, achieving Test RMSE of `925.28` and MAPE of `9.92%`
- Deployed real-time model inference endpoint via SageMaker SDK (`boto3`)
- Built serverless API integration layer using AWS Lambda and API Gateway
- Configured CloudWatch metrics dashboard for operational health and data drift detection

## Deployment Execution Timeline

| Technical Phase | Execution Time |
|-----------------|----------------|
| 1. Architecture Overview | 10 mins |
| 2. Environment Prerequisites | 15 mins |
| 3. Data Processing & Features | 30 mins |
| 4. Model Training | 30 mins |
| 5. Endpoint & API Deployment | 45 mins |
| 6. Resource Cleanup | 10 mins |
| **Total** | **~2.5 hours** |

## Implementation Cost Breakdown

~$2–5 USD (SageMaker Endpoint active hosting during ~1 hour testing window)

{{% notice warning %}}
**Operational Protocol:** Our team strictly executed automated cleanup scripts to terminate SageMaker Endpoints after testing to ensure AWS resource cost optimization.
{{% /notice %}}

## Workshop Modules

1. [Workshop Overview](5.1-Workshop-overview)
2. [Prerequisites & Setup](5.2-Prerequiste)
3. [Data Processing](5.3-S3-vpc)
4. [Model Training](5.4-S3-onprem)
5. [Deployment & API](5.5-Policy)
6. [Resource Cleanup](5.6-Cleanup)