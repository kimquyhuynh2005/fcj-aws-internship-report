---
title: "Feedback"
date: 2026-06-06
weight: 6
chapter: false
pre: "<b>6. </b>"
---

# Feedback — AWS First Cloud AI Journey

**Submitted by:** Huynh Kim Quy  
**Program:** Workforce Bootcamp — First Cloud AI Journey  
**Company:** Amazon Web Services Viet Nam Company Limited  
**Period:** 06/06/2026 – 15/08/2026

---

## Overall Satisfaction

**Rating: 4/5** — Very satisfied with the program

---

## Program Strengths

### 1. Real-world Project Focus
The program's emphasis on building a real project (not just following tutorials) was the most valuable aspect. Working with a real dataset (Rossmann, 1M+ records) and encountering real AWS limitations (quota issues, SDK bugs) created learning experiences impossible to get from structured courses.

### 2. Team-based Learning
Working in a 3-person team with divided responsibilities (Data/ML, Infra/AWS, Backend) closely mirrors real industry workflows. This collaborative structure significantly improved both technical and communication skills.

### 3. Technical Depth
The program covered the full ML lifecycle — from data preprocessing to deployment, monitoring, and pipeline automation. This end-to-end exposure is rare in academic settings.

### 4. AWS Resource Access
Having access to real AWS accounts (even with some quota limitations) provided hands-on cloud experience that no simulated environment can replicate.

---

## Areas for Improvement

### 1. Service Quota Guidance
The team spent significant time dealing with SageMaker service quotas that were 0 on new accounts. The program could benefit from:
- A pre-check guide for required quotas before Week 1
- Pre-configured accounts with appropriate quotas for bootcamp participants

### 2. SDK Version Documentation
SageMaker Python SDK had breaking issues in version 3.x. A pinned, tested dependency list at the start of the program would save debugging time.

### 3. More Structured Mentorship
While self-directed learning is valuable, more scheduled code reviews or technical Q&A sessions with AWS practitioners would accelerate problem resolution.

### 4. Mid-program Check-ins
A structured mid-point review (around Week 4–5) would help teams course-correct earlier rather than discovering issues in Week 6–7.

---

## Recommendations for Future Participants

Based on my 12-week experience, my top advice for incoming bootcamp participants:

1. **Check service quotas on Day 1** — run `check_quota.py` before writing any code
2. **Use boto3 directly** — more stable than SageMaker SDK for complex workflows
3. **Document as you go** — don't leave documentation to the final 4 weeks
4. **Embrace workarounds** — real cloud engineering is about solving problems creatively when ideal tools are unavailable
5. **Clean up endpoints immediately** — SageMaker Endpoints charge by the hour even when idle

---

## Skills I Will Use in My Career

| Skill | Direct Application |
|-------|-------------------|
| IAM Least Privilege | Every AWS project |
| boto3 API patterns | Any Python-based cloud automation |
| XGBoost + feature engineering | Tabular ML projects |
| SageMaker Endpoint deployment | ML production systems |
| CloudWatch monitoring | Production observability |
| IaC deployment scripts | Repeatable infrastructure |

---

## Final Message

The AWS First Cloud AI Journey program provided me with real-world cloud engineering experience that significantly exceeded what I could have gained from self-study or academic courses alone.

The most important learning: **the best engineers aren't the ones who avoid problems — they're the ones who understand why problems happen and fix them systematically.**

Thank you to the FCJ team, AWS Vietnam, and my teammates (Van Thai Quan and Nguyen Ngoc Sang) for making this 12 weeks exceptional.

---

*Huynh Kim Quy | kimquyhuynh2005@gmail.com | AWS062026*
