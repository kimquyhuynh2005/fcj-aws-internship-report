---
title: "Worklog"
date: 2026-06-06
weight: 1
chapter: false
pre: "<b>1. </b>"
---

# Worklog — AWS ML Internship Project

> **Team:** Huynh Kim Quy (Data/ML) · Van Thai Quan (Infra/AWS) · Nguyen Ngoc Sang (Backend/API)  
> **Duration:** 8 weeks  
> **Status:** Complete ✅

---

## AWS Account & Infrastructure Setup

| Item | Team Account (Weeks 1–5) | Van's Account (Weeks 6–8) |
|------|-------------------------|--------------------------|
| Account ID | `119505195050` | `897355252080` |
| Region | `ap-southeast-1` | `ap-southeast-1` |
| S3 Bucket | `s3://aws-internship-hkq-2026` | `s3://quanvan-ml-forecasting-2026` |
| IAM Role | `SageMaker-ExecutionRole-hkq` | `SageMaker-ExecutionRole-QuanVan` |

---

## Service Quotas & Workarounds Summary

| Blocked Service | Workaround Applied | Weeks |
|-----------------|------------------- |-------|
| SageMaker Training Jobs (quota = 0) | Train locally, log metrics via boto3 | 3–4 |
| SageMaker Model Registry (quota = 0) | Save metadata JSON to S3 | 5 |
| SageMaker SDK 3.x broken | Use `boto3.client()` directly | All |
| AWS CLI multipart upload error | Use `boto3.upload_file()` | 2 |
| SageMaker Endpoint (quota = 0 on team account) | Use Van's personal account | 6 |
| SageMaker Pipelines (quota = 0) | Local orchestration script (`simple_orchestration.py`) | 8 |

---

## Weekly Activity Summary

| Week | Topic | Lead Owner | Deliverables |
|------|-------|------------|--------------|
| [Week 1](1.1-week1/) | AWS Environment Setup | Huynh Kim Quy | `config.py`, `verify_setup.py`, S3 bucket setup |
| [Week 2](1.2-week2/) | Data Preprocessing & EDA | Huynh Kim Quy | `preprocessing.py`, `train.csv`, `val.csv`, `test.csv` |
| [Week 3](1.3-week3/) | XGBoost Baseline + LSTM Skeleton | Huynh Kim Quy | `train_xgboost.py` (RMSE 925.28), `model.py` skeleton |
| [Week 4](1.4-week4/) | Train PyTorch LSTM | Huynh Kim Quy | `train_lstm.py` (RMSE 3044.43), model selection |
| [Week 5](1.5-week5/) | Model Registry + SHAP | Huynh Kim Quy | `shap_analysis.py`, `model_registry.py` (S3 JSON) |
| [Week 6](1.6-week6/) | Deployment + REST API | Van Thai Quan | `deploy_endpoint.py`, `deploy_lambda.py` (API live) |
| [Week 7](1.7-week7/) | Monitoring + Drift Detection | Nguyen Ngoc Sang | `drift_simulator.py`, `CloudWatch Dashboard` |
| [Week 8](1.8-week8/) | Pipeline + Refactor | Van Thai Quan | `pipeline_definition.py`, `simple_orchestration.py` |
