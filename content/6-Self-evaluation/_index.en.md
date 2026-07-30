---
title: "Self-evaluation"
date: 2026-06-06
weight: 6
chapter: false
pre: "<b>6. </b>"
---

# Self-Evaluation & Internship Reflection

Comprehensive assessment of personal performance, technical skill acquisition, problem resolution, and project achievements during the **8-week AWS First Cloud AI Journey internship**.

**Evaluator:** Huynh Kim Quy  
**Role:** Data & Machine Learning Engineer Intern  
**Program:** Workforce Bootcamp — First Cloud AI Journey (FCAJ)  
**Company:** Amazon Web Services Viet Nam Company Limited  
**Period:** 06/06/2026 – 15/08/2026 (8 active working weeks)  

---

## 1. Evaluation Criteria Table

The table below summarizes the evaluation across 8 core professional criteria based on concrete deliverables completed during the internship:

| # | Evaluation Criteria | Achievement Rating | Detailed Evidence & Operational Notes |
|---|--------------------|-------------------|--------------------------------------|
| 1 | **Technical AWS Knowledge** | **Good (Tốt)** | Mastered hands-on implementation across 7 core AWS services: Amazon S3 (Data Lake Architecture & Bucket Policies), AWS IAM (Least Privilege Roles), Amazon SageMaker (Endpoints, Experiments Tracking, Pipelines), AWS Lambda, Amazon API Gateway, and Amazon CloudWatch. |
| 2 | **Machine Learning Skills** | **Good (Tốt)** | Extracted 22 time-series features (Rolling Means 7/14/30, Lag features 7/14/30, Calendar Features); trained XGBoost Regressor (v1.7.6) achieving impressive performance: Test RMSE **925.28** and Test MAPE **9.92%** (exceeding initial RMSE target of ~1,200). |
| 3 | **Problem-Solving & Debugging** | **Good (Tốt)** | Diagnosed and permanently resolved 3 major production issues: Requesting SageMaker Training Job quota increases, pinning `sagemaker==2.257.5` SDK dependency versions, and fixing numerical overflow (Infinity) during log transformation with `np.expm1()`. |
| 4 | **Code Quality & Architecture** | **Fair (Khá)** | Codebase organized cleanly into self-contained modules (`sourcedir.tar.gz`). Future improvement includes extending automated Unit Test coverage across data processing pipelines. |
| 5 | **Teamwork & Collaboration** | **Good (Tốt)** | Seamless division of responsibilities across the 3-person team (Data/ML: Huynh Kim Quy, Backend: Nguyen Ngoc Sang, Infrastructure: Van Thai Quan) with transparent communication and regular check-ins. |
| 6 | **Time Management** | **Fair (Khá)** | Delivered 100% of project milestones across the 8-week timeline. Week 6 schedule experienced temporary quota bottlenecks but recovered quickly to maintain deadline commitments. |
| 7 | **Technical Documentation** | **Good (Tốt)** | Authored 3 academic-grade Technical Blog posts published on the AWS Study Group community and authored the comprehensive master workshop guide (`Workshop_AWS_ML_Forecasting.md`). |
| 8 | **Initiative & Proactiveness** | **Good (Tốt)** | Proactively identified cloud resource limits early; proposed and designed the Serverless REST API architecture combining AWS Lambda + API Gateway for public SageMaker Endpoint access. |

> **Rating Scale:** **Good (Tốt)** > **Fair (Khá)** > **Average (Trung bình)**

---

## 2. Technical Skills Acquired

### 2.1. AWS Cloud Infrastructure
- ✅ **Amazon S3:** Multi-tier Data Lake architecture (`raw/`, `processed/`, `models/`), bucket policies, versioning, and `boto3` SDK integration.
- ✅ **AWS IAM:** Role and inline policy definition following Least Privilege security principles for SageMaker Execution Role and Lambda Execution Role.
- ✅ **Amazon SageMaker:** Real-time Endpoint deployment (`ml.t2.medium`), experiment tracking via SageMaker Experiments, and MLOps automation via SageMaker Pipelines.
- ✅ **AWS Lambda & API Gateway:** Serverless REST API wrapper handling JSON payload validation and `sagemaker-runtime.invoke_endpoint` invocations.
- ✅ **Amazon CloudWatch:** Monitoring dashboard (`RossmannForecastingDashboard`) capturing API latency, request counts, and statistical data drift metrics.

### 2.2. Machine Learning & Data Engineering
- ✅ **Time Series Feature Engineering:** Rolling means (7, 14, 30 days), lag features, and calendar indicators.
- ✅ **Model Optimization:** XGBoost training, Optuna hyperparameter tuning, early stopping to prevent overfitting.
- ✅ **Evaluation & Interpretability:** Performance evaluation via RMSE/MAPE; feature importance analysis using SHAP values.
- ✅ **Data Quality Gate:** Statistical Z-score data drift detection and strict chronological train/val/test splits to eliminate data leakage.

---

## 3. Key Accomplishments During 8 Weeks

1. **Superior Model Accuracy:** XGBoost model achieved Test RMSE **925.28** and MAPE **9.92%**, significantly outperforming initial baseline targets.
2. **Production Deployment:** Live REST API tested on real store data (Store 1, 2015-06-15) achieved a **4.58% error rate** with **~1.1s latency**.
3. **Real-World Problem Solving:** Successfully resolved 3 major cloud deployment bottlenecks through systematic Root Cause Analysis.
4. **Knowledge Sharing:** Published 3 technical blog posts and authored a master hands-on workshop guide.

---

## 4. Personal Reflection & Key Takeaways

The **8-week internship** at the AWS First Cloud AI Journey program far exceeded my initial expectations for practical learning. The most valuable experience was not merely producing a functional REST API—it was the **debugging journey**: identifying cloud quota limits, resolving SDK dependency conflicts, and understanding numerical overflow behavior in log transformations.

These are practical cloud engineering skills that static tutorials cannot impart. Real-world projects encounter unforeseen challenges, and learning to diagnose and resolve them systematically constitutes the core competence of a Cloud Engineer.

> **Advice for Future Work:** Always verify AWS Service Quotas on Day 1 of any new cloud deployment, and maintain continuous documentation throughout the project duration.

---

## 5. Overall Performance Summary

```
Technical AWS Knowledge:    ████████░░  Good (Tốt)
Machine Learning Skills:    ████████░░  Good (Tốt)
Problem-solving:            ████████░░  Good (Tốt)
Code Quality:               ██████░░░░  Fair (Khá)
Teamwork:                   ████████░░  Good (Tốt)
Time Management:            ██████░░░░  Fair (Khá)
Documentation:              ████████░░  Good (Tốt)
Initiative:                 ████████░░  Good (Tốt)
```

**OVERALL RATING: GOOD / EXCELLENT** (Achieved 100% of 8-week goals with high-quality real-world deliverables).
