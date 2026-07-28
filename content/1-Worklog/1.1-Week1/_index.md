---
title: "Week 1 — AWS Environment Setup"
date: 2026-06-06
weight: 1
chapter: false
pre: "<b>1.1. </b>"
---

## Week 1 — AWS Environment Setup ✅

**Owner:** Huynh Kim Quy | **Period:** 06/06/2026 – 12/06/2026

---

### Tasks Completed

1. **AWS Account & IAM Configuration**
   - Account ID: `119505195050` | Region: `ap-southeast-1` (Singapore)
   - Created IAM Role: `SageMaker-ExecutionRole-hkq` with Least Privilege inline policy
   - Restricted S3 access to `s3://aws-internship-hkq-2026` only

2. **S3 Bucket Setup**
   - Created bucket: `s3://aws-internship-hkq-2026`
   - Enabled versioning and configured bucket policies

3. **Development Environment**
   - Configured AWS CLI with SSO login
   - Created Python virtual environment with `requirements.txt`
   - Wrote `config.py` (all S3 paths, ARNs, constants in one file)
   - Wrote `verify_setup.py` to validate AWS connectivity

4. **Discovered Service Quota Issue**
   - SageMaker Training Jobs quota = 0 on team account
   - Documented workarounds: train locally, log metrics via boto3

---

### Results

```
✅ AWS Account:  119505195050
✅ S3 Bucket:    s3://aws-internship-hkq-2026
✅ IAM Role:     SageMaker-ExecutionRole-hkq (Least Privilege)
✅ SageMaker:    API OK — region ap-southeast-1
✅ Python env:   venv activated, requirements installed
✅ verify_setup.py: ALL CHECKS PASSED
```

### Startup Script
```powershell
cd "E:\AWS - TTNT\aws-internship-ML-forecasting"
.\venv\Scripts\activate
aws login   # Credentials expire every ~8 hours
python verify_setup.py
```

---

### Lessons Learned
- Always check SageMaker service quotas **before** writing code — `check_quota.py` becomes a day-1 tool
- IAM Least Privilege is harder than it looks; use inline policies instead of managed policies for fine-grained control
- AWS SSO credentials expire every ~8 hours — build `aws login` into team workflow
