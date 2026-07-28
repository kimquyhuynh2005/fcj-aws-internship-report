---
title: "Workshop"
date: 2026-06-06
weight: 4
chapter: false
pre: "<b>4. </b>"
---

# Workshop: E-commerce Sales Forecasting Pipeline on AWS

## Overview

In this workshop, you will build a complete **end-to-end Machine Learning pipeline** on AWS to forecast daily sales for a retail chain. This is based on the actual project completed during the AWS First Cloud AI Journey internship.

{{% notice info %}}
**Real Project:** This workshop is based on actual work performed during a 12-week AWS internship. All code, results, and configurations are from a real implementation — not a tutorial demo.
{{% /notice %}}

## What You Will Build

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

## AWS Services Used

| Service | Purpose |
|---------|---------|
| Amazon S3 | Data storage, model artifacts |
| AWS IAM | Least privilege roles |
| Amazon SageMaker | Model deployment endpoint |
| AWS Lambda | Serverless inference wrapper |
| Amazon API Gateway | Public REST API |
| Amazon CloudWatch | Monitoring dashboard |

## Learning Objectives

After completing this workshop, you will be able to:
- Preprocess and feature-engineer time series data for ML
- Train an XGBoost model and evaluate with RMSE/MAPE
- Deploy a model to SageMaker Endpoint using boto3
- Build a serverless inference API with Lambda + API Gateway
- Monitor model health and detect data drift

## Estimated Time

| Section | Time |
|---------|------|
| 1. Overview | 10 min |
| 2. Prerequisites | 15 min |
| 3. Data Processing | 30 min |
| 4. Model Training | 30 min |
| 5. Deployment & API | 45 min |
| 6. Cleanup | 10 min |
| **Total** | **~2.5 hours** |

## Estimated Cost

~$2–5 USD (SageMaker Endpoint for ~1 hour)

{{% notice warning %}}
**Important:** Always run the Cleanup step to delete the SageMaker Endpoint after completing the workshop. Endpoints charge by the hour even when idle.
{{% /notice %}}

## Workshop Sections

1. [Workshop Overview](5.1-Workshop-overview)
2. [Prerequisites](5.2-Prerequiste)
3. [Data Processing](5.3-S3-vpc)
4. [Model Training](5.4-S3-onprem)
5. [Deployment & API](5.5-Policy)
6. [Cleanup](5.6-Cleanup)