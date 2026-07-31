---
title: "Blog 2: Tracking Machine Learning Experiments with Amazon SageMaker Experiments"
date: 2026-06-06
weight: 2
chapter: false
pre: "<b>3.2. </b>"
---

> **Author:** Nguyen Ngoc Sang  
> **Category:** Machine Learning Engineering / Experiment Tracking  
> **Community:** AWS Study Group  
> **Project:** E-commerce Sales Forecasting on AWS SageMaker  
> 🔗 **Facebook Post:** [View Post on Facebook Group](https://www.facebook.com/groups/awsstudygroupfcj/permalink/2227796681318625/?rdid=lrEgZ0DETtn6dY8p#)  

---

## Tracking Machine Learning Experiments with Amazon SageMaker Experiments

During the development of a sales forecasting project on AWS, I realized that model training is only a small part of the work. The more time-consuming, and often overlooked, task is experiment management: tracking parameters tried, metrics achieved, and identifying the best model run. As experiment iterations increase, relying solely on log files or notebooks becomes insufficient.

Amazon SageMaker Experiments is the service I utilized to address this challenge. Notably, training models on SageMaker is not a prerequisite to leveraging this feature; the entire tracking workflow can be integrated directly into local Python training scripts via `boto3`.

---

## 1. Background: Challenges of Manual Experiment Management

Initial experiment runs with XGBoost were straightforward to manage by recording parameters and metrics into a CSV file. However, as iterations exceeded dozens of runs, multi-dimensional comparisons became necessary—evaluating RMSE alongside MAPE, training duration, feature counts, and hyperparameter sets simultaneously.

CSV-based tracking required manual schema maintenance, custom visualization code, and was prone to data entry errors. Sharing results with team members required transmitting files and explaining structures, lacking a centralized dashboard for collective review.

---

## 2. What is Amazon SageMaker Experiments?

SageMaker Experiments provides a structured framework to organize, track, and evaluate Machine Learning experiment iterations. It establishes a hierarchical architecture consisting of **Experiments** (overall objective), **Runs** (individual execution instances), and **Metrics** (logged performance indicators).

Once metrics are logged to SageMaker Experiments, the AWS Management Console enables direct column comparison, conditional filtering, and visual chart generation without additional visualization code.

---

## 3. Local Script Integration via Boto3

Because model training was executed on local computing resources rather than SageMaker Training Jobs, integration was accomplished by invoking `boto3` APIs directly within Python scripts.

An Experiment is initialized to group related execution runs. For each training iteration, a new Run instance is created to record input parameters (such as learning rate, max depth, estimator counts) and output metrics (validation/test RMSE and MAPE). This process requires minimal `boto3` code statements placed within the training loop.

Proper AWS credentials must be configured on the host machine, and the IAM entity requires permissions for `sagemaker:CreateExperiment`, `sagemaker:CreateRun`, and `sagemaker:BatchPutMetrics`.

---

## 4. Visual Experiment Comparison

With data aggregated across multiple runs, the SageMaker Experiments console allows selecting multiple Run instances for side-by-side tabular comparison. Key insights—such as optimal hyperparameter configurations, learning rate sensitivity, and feature importance impacts—can be identified immediately.

Additionally, step-level metric charts display learning curves across boosting rounds, helping identify overfitting inflection points and verifying early stopping behavior.

---

## 5. Key Considerations

- **Experiment Name Uniqueness:** Experiment identifiers must be unique within an AWS region and account. Incorporating timestamps or using `try/except` handling for `ResourceInUse` exceptions ensures smooth execution.
- **Data Retention:** Logged experiment records are retained permanently unless explicitly deleted via SageMaker cleanup APIs.
- **Cost Management:** SageMaker Experiments pricing is based on the volume of logged metrics. For small-to-medium projects, costs are minimal.

---

## 6. Conclusion

Amazon SageMaker Experiments provides a scalable tracking solution with a visual interface and centralized storage, without requiring infrastructure migration to the cloud. Adding a few `boto3` API calls to existing local training scripts establishes an enterprise-grade experiment management workflow.

---

### References
- [AWS Documentation – Amazon SageMaker Experiments](https://docs.aws.amazon.com/sagemaker/latest/dg/experiments.html)
- [AWS Documentation – SageMaker Python SDK Experiments](https://sagemaker-experiments.readthedocs.io/)
