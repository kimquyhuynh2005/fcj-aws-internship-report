---
title: "Feedback & Recommendations"
date: 2026-06-06
weight: 7
chapter: false
pre: "<b>7. </b>"
---

# Feedback & Recommendations — AWS First Cloud AI Journey

Summary of reflections, program feedback, and professional recommendations based on **8 active working weeks** in the AWS First Cloud AI Journey program.

**Submitter:** Huynh Kim Quy  
**Role:** Data & Machine Learning Engineer Intern  
**Program:** Workforce Bootcamp — First Cloud AI Journey (FCAJ)  
**Company:** Amazon Web Services Viet Nam Company Limited  
**Period:** 06/06/2026 – 15/08/2026 (8 internship weeks)  

---

## 1. Overall Satisfaction

**Rating: 4.8 / 5.0** — *Highly satisfied with the hands-on curriculum and corporate learning environment at AWS Viet Nam.*

---

## 2. Program Key Strengths

### 2.1. Hands-on Production Project Focus
The core strength of the program lies in building real-world enterprise products rather than executing static tutorials. Working directly with a large e-commerce dataset (Rossmann Store Sales with over 1 million records) and addressing real cloud resource constraints (Service Quotas, IAM Permission Boundaries) cultivates problem-solving competencies unattainable in traditional academic environments.

### 2.2. Cross-Functional Team Collaboration
The 3-person team model with clear role specialization:
- **Data & Machine Learning Engineer:** Huynh Kim Quy
- **Backend & Monitoring Engineer:** Nguyen Ngoc Sang
- **Infrastructure & AWS Cloud Engineer:** Van Thai Quan

This setup accurately reflects production MLOps engineering workflows in tech enterprises, significantly improving technical collaboration and communication skills.

### 2.3. End-to-End MLOps Depth
The curriculum covers the complete modern MLOps lifecycle: data preprocessing, 22 time-series feature engineering, model training (XGBoost vs. PyTorch LSTM), experiment tracking (SageMaker Experiments), automated pipeline packaging (SageMaker Pipelines), serverless API serving (AWS Lambda + API Gateway), and operational data drift monitoring (CloudWatch Monitoring).

### 2.4. Real AWS Cloud Resource Access
Hands-on access to production AWS Cloud environments builds practical expertise in operational cost management, Least Privilege IAM design, and Python `boto3` SDK automation.

---

## 3. Recommendations for Future Program Iterations

### 3.1. Early Service Quota Onboarding & Configuration
Resolving default `SageMaker Training Jobs` quota limitations (set to zero on new accounts) required significant troubleshooting time. Key recommendations:
- Include explicit quota verification and request instructions during Week 1 onboarding.
- Pre-configure bootcamp accounts with default quotas for dedicated training instance types (`ml.m5.large`, `ml.t2.medium`).

### 3.2. Standardized Dependency Version Pinning
Due to architectural updates across SageMaker Python SDK versions (v2.x vs. v3.x), providing a tested `requirements.txt` environment configuration from Day 1 will prevent SDK version conflict overhead.

### 3.3. Scheduled Technical Code Reviews
Complementing self-directed research with scheduled code review sessions or Q&A meetings led by AWS Solutions Architects / ML Specialists will help interns refine code architecture.

---

## 4. Key Takeaways & Advice for Future Interns

Based on **8 weeks of practical experience**, here are 5 valuable recommendations for upcoming interns:

1. **Verify Service Quotas on Day 1:** Run quota verification scripts prior to executing training pipelines.
2. **Utilize `boto3` API Directly:** Direct API calls offer greater stability and flexibility for complex custom workflows compared to high-level SDK wrappers.
3. **Maintain Continuous Documentation:** Document technical steps and troubleshooting notes weekly rather than deferring documentation to final weeks.
4. **Embrace Pragmatic Problem Solving:** In production cloud engineering, developing creative workarounds under resource constraints is an essential skill.
5. **Promptly Clean Up Compute Endpoints:** Delete SageMaker Endpoints immediately following testing to eliminate hourly compute charges.

---

## 5. Career Competencies & Industry Applications

| Technical Skill | Direct Industry Application |
|-----------------|-----------------------------|
| **AWS IAM Least Privilege** | Secure cloud access architecture across enterprise deployments |
| **Python `boto3` SDK API** | Cloud infrastructure automation and automated data pipelines |
| **XGBoost & Feature Engineering** | Production tabular and time-series Machine Learning projects |
| **SageMaker Endpoint Deployment** | Hosting production Machine Learning inference services |
| **CloudWatch Monitoring & Drift** | Real-time model health observation and statistical drift detection |
| **MLOps & Automation Pipelines** | CI/CD automation for artificial intelligence workloads |

---

## 6. Conclusion

The AWS First Cloud AI Journey program provided an invaluable professional growth experience across **8 active working weeks**. The single most important lesson learned: **An exceptional Cloud Engineer is not defined by never encountering errors—but by understanding their root cause and resolving them systematically.**

Sincere thanks to the FCJ organizing team, AWS Vietnam, and my dedicated teammates (Van Thai Quan and Nguyen Ngoc Sang) for making these 8 weeks exceptionally productive and memorable!

---

*Huynh Kim Quy | Data & ML Engineer Intern | AWS First Cloud AI Journey 2026*
