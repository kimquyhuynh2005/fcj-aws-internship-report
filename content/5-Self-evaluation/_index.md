---
title: "Self-evaluation"
date: 2026-06-06
weight: 5
chapter: false
pre: "<b>5. </b>"
---

# Self-evaluation

Assessment of personal performance and skill development during the 12-week AWS First Cloud AI Journey internship.

**Evaluator:** Huynh Kim Quy  
**Period:** 06/06/2026 – 06/09/2026

---

## Evaluation Criteria

| # | Criteria | Rating | Notes |
|---|---------|--------|-------|
| 1 | Technical AWS Knowledge | **Tốt / Good** | Mastered S3, IAM, SageMaker, Lambda, API Gateway, CloudWatch |
| 2 | Machine Learning Skills | **Tốt / Good** | Successfully trained XGBoost with RMSE 925.28, MAPE 9.92% |
| 3 | Problem-solving & Debugging | **Tốt / Good** | Resolved 3 real deployment errors; multiple quota workarounds |
| 4 | Code Quality | **Khá / Fair** | Code works but documentation could be more consistent |
| 5 | Teamwork & Collaboration | **Tốt / Good** | Effective division of work with team; clear communication |
| 6 | Time Management | **Khá / Fair** | Most deliverables on time; Week 6 took longer than planned |
| 7 | Documentation | **Khá / Fair** | Improved significantly during Weeks 9–12 |
| 8 | Initiative & Proactiveness | **Tốt / Good** | Identified quota issues early; proposed workarounds |

**Scale:** Tốt (Good) > Khá (Fair) > Trung bình (Average)

---

## Technical Skills Acquired

### AWS Services (Hands-on)
- ✅ **Amazon S3** — bucket creation, policies, versioning, boto3 upload/download
- ✅ **AWS IAM** — roles, inline policies, least privilege design
- ✅ **Amazon SageMaker** — Endpoint deployment, model packaging, Experiments tracking
- ✅ **AWS Lambda** — function creation, IaC deployment, SageMaker integration
- ✅ **Amazon API Gateway** — REST API, Lambda Proxy, stage deployment
- ✅ **Amazon CloudWatch** — dashboard creation, metrics, log groups
- ✅ **SageMaker Pipelines** — Pipeline definition JSON, boto3 creation

### ML/Data Engineering Skills
- ✅ Feature engineering for time series (rolling means, lags, date features)
- ✅ XGBoost training, hyperparameter tuning, early stopping
- ✅ Model evaluation: RMSE, MAPE
- ✅ SHAP feature importance analysis
- ✅ Statistical drift detection (z-score)
- ✅ Data leakage prevention (chronological splits, proper scaling)
- 🔄 PyTorch LSTM (basic implementation, needs improvement)

---

## Key Accomplishments

1. **Best model result:** RMSE 925.28, MAPE 9.92% — exceeded initial target of RMSE ~1,200
2. **Production deployment:** Successfully deployed REST API with 5.14% error on real data
3. **Real debugging:** Solved 3 concrete deployment errors with root cause analysis
4. **Pragmatic workarounds:** Navigated quota limitations without blocking project progress
5. **Knowledge sharing:** Published 3 technical blog posts and presented at AWS Study Group Q&A

---

## Areas for Improvement

1. **Deep Learning:** LSTM implementation needs better normalization and longer training
2. **Testing:** Should have written more unit tests throughout the project
3. **Documentation:** Started documentation too late (Week 9 vs. continuous)
4. **Cost optimization:** Could have used Spot Instances for training experiments

---

## Personal Reflection

The 12-week internship exceeded my expectations in terms of practical learning. The most valuable experience was not the final working API — it was the debugging journey: discovering quota limitations, resolving XGBoost version conflicts, and understanding why `np.expm1()` caused Infinity predictions.

These are the lessons that no tutorial can teach. Real projects break in unexpected ways, and learning to diagnose and fix those breaks is the core skill of a cloud engineer.

**What I would do differently:** Check service quotas on Day 1 of any new AWS project, and start documentation from Week 1 — not Week 9.

---

## Rating Summary

```
Technical AWS Knowledge:    ████████░░  Good
Machine Learning Skills:    ████████░░  Good
Problem-solving:            ████████░░  Good
Code Quality:               ██████░░░░  Fair
Teamwork:                   ████████░░  Good
Time Management:            ██████░░░░  Fair
Documentation:              ██████░░░░  Fair
Initiative:                 ████████░░  Good
```

**Overall Rating: Khá — Good** (above average, with clear growth areas identified)
