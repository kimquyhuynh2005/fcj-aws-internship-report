---
title: "Blog 3: From Local Notebook to Production MLOps: Mastering AWS SageMaker Pipelines"
date: 2026-06-06
weight: 3
chapter: false
pre: "<b>3.3. </b>"
---

> **Author:** Huynh Kim Quy  
> **Category:** Machine Learning Engineering / MLOps  
> **Community:** AWS Study Group  
> **Project:** E-commerce Sales Forecasting on AWS SageMaker  

---

## From Local Notebook to Production MLOps: Mastering AWS SageMaker Pipelines

When starting out in Machine Learning, workflows typically execute locally within Jupyter Notebooks—covering data preprocessing, model training, and evaluation. In enterprise environments, however, the challenge shifts to automating and scaling end-to-end pipelines while exposing trained models via secure interfaces.

This article details the architecture and practical takeaways from transitioning a sales forecasting model (Rossmann dataset) to AWS.

---

## 1. Three-Layer MLOps Architecture

The system decouples the Machine Learning lifecycle into three distinct layers:

### Layer 1: Data Lake & Baseline Modeling
- Raw datasets are centralized in **Amazon S3 Buckets**.
- Preprocessing generates structured `train.csv`, `val.csv`, and `test.csv` splits. Baseline evaluations demonstrated that XGBoost achieved a **9.92% MAPE**, outperforming the 2-layer PyTorch LSTM (**32.79% MAPE**), establishing XGBoost as the production algorithm.

### Layer 2: Continuous Integration with SageMaker Pipelines
- Machine Learning workflows are orchestrated using **SageMaker Pipelines** (`Rossmann-Sales-Pipeline`).
- Preprocessing and training scripts are packaged into `sourcedir.tar.gz` artifacts stored on S3 for self-contained pipeline execution.
- Pipeline execution provisions compute resources, retrieves data from S3, executes training jobs, and stores trained model artifacts back to S3.

### Layer 3: Continuous Deployment & Real-Time Serving
- SageMaker Endpoints are exposed via a **Serverless REST API** architecture combining **Amazon API Gateway** and **AWS Lambda**.
- AWS Lambda intercepts REST payloads from API Gateway, invokes `sagemaker-runtime.invoke_endpoint`, and formats JSON predictions. Production evaluation on real test payloads achieved a **4.75% error rate**.

---

## 2. Practical Takeaways & Production Lessons

- **Service Quotas:** Default AWS account quotas for `SageMaker Training Jobs` may be set to zero initially. Proactively request quota increases for required instance types (e.g., `ml.m5.large`) via the AWS Support Console before deployment.
- **Dependency Pinning:** Explicitly pin library versions (e.g., `sagemaker==2.257.5`) to prevent runtime errors caused by automatic SDK updates.
- **Cost Management:** SageMaker Endpoints incur hourly compute charges while running. Implement automated cleanup scripts (`cleanup.py`) to delete non-production endpoints after testing.

---

## 3. Conclusion

Transitioning models from Jupyter Notebooks to automated MLOps pipelines on AWS SageMaker establishes repeatable, enterprise-grade deployment standards while optimizing operational reliability and compute costs.
