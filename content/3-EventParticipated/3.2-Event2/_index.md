---
title: "Event 2 — AWS Study Group Weekly Session"
date: 2026-07-15
weight: 2
chapter: false
pre: "<b>3.2. </b>"
---

## Event 2: AWS Study Group Weekly Technical Session

**Event Name:** AWS Study Group — Weekly Technical Workshop  
**Date:** July 15, 2026  
**Location:** Online (Zoom)  
**Organizer:** AWS Study Group Vietnam  
**Role:** Attendee & Q&A participant

---

### Event Overview

The AWS Study Group hosts weekly online sessions where practitioners and learners share technical knowledge about AWS services. This particular session focused on **SageMaker Endpoints and serverless inference patterns** — directly relevant to our Week 6 deployment task.

### Session Content

| Topic | Duration |
|-------|---------|
| SageMaker Endpoint deployment patterns | 30 min |
| Lambda integration with SageMaker | 20 min |
| IAM best practices for ML workloads | 20 min |
| Q&A session | 30 min |

### Key Learnings Applied to Our Project

1. **Container Image URIs:** The presenter confirmed the correct approach — use `sagemaker.image_uris.retrieve()` to get region-specific URIs. This solved our `ValidationException` from Week 6.

2. **Lambda Timeout Configuration:** Setting Lambda timeout to 30 seconds is recommended when calling SageMaker Endpoints (cold start can take 5–10 seconds).

3. **IAM Least Privilege Pattern:** The session provided a template for scoped IAM policies — we adapted this for our `SageMaker-ExecutionRole-QuanVan`.

4. **Endpoint Cleanup Reminder:** The presenter emphasized automatic cleanup scripts — reinforcing our decision to write `cleanup.py`.

### Personal Contribution

During the Q&A session, I shared our team's experience with:
- The XGBoost version pinning issue (version mismatch causing ModelError 500)
- The `np.expm1()` trap when target was not log-transformed
- Using personal accounts as workaround for quota limits

The presenter found these real-world debugging stories valuable for other participants.

### Resources Shared

- [AWS Study Group Blog](https://awsstudygroup.com)
- [AWS Study Group Facebook Group](https://www.facebook.com/groups/awsstudygroupfcj)

---

### Impact on Project

Attending this session directly contributed to resolving the Week 6 deployment challenges. The Q&A interaction with practitioners gave us confidence that our boto3-based approach (instead of SageMaker SDK) was the right choice given our environment constraints.
