---
title: "Internship Report"
date: 2026-06-06
weight: 1
chapter: false
---

# Internship Report — AWS First Cloud AI Journey

{{% notice info %}}
This report documents my real internship project at **Amazon Web Services Viet Nam Company Limited** through the **First Cloud AI Journey** program. All content reflects actual work performed during the internship period from June to September 2026.
{{% /notice %}}

## Student Information

<div style="display: flex; gap: 24px; align-items: flex-start; margin-top: 15px; margin-bottom: 25px; flex-wrap: wrap;">
  <div style="flex-shrink: 0; text-align: center;">
    <img src="/images/avatar.png" alt="Intern Profile Photo - Huynh Kim Quy" style="width: 160px; height: 210px; object-fit: cover; border-radius: 10px; border: 3px solid #0284c7; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); display: block;" />
    <small style="display: block; margin-top: 8px; color: #94a3b8; font-size: 0.82rem;">(Intern Profile Photo)</small>
  </div>
  <div style="flex: 1; min-width: 280px; line-height: 1.8;">
    <p style="margin-bottom: 6px;"><strong>Full Name:</strong> Huynh Kim Quy</p>
    <p style="margin-bottom: 6px;"><strong>Phone:</strong> 0911263926</p>
    <p style="margin-bottom: 6px;"><strong>Email:</strong> kimquyhuynh2005@gmail.com</p>
    <p style="margin-bottom: 6px;"><strong>University:</strong> Ho Chi Minh City University of Technology (HCMUT)</p>
    <p style="margin-bottom: 6px;"><strong>Major:</strong> Computer Science</p>
    <p style="margin-bottom: 6px;"><strong>Class:</strong> AWS062026</p>
    <p style="margin-bottom: 6px;"><strong>Host Company:</strong> Amazon Web Services Viet Nam Company Limited</p>
    <p style="margin-bottom: 6px;"><strong>Internship Position:</strong> Workforce Bootcamp — First Cloud AI Journey</p>
    <p style="margin-bottom: 6px;"><strong>Duration:</strong> 06/06/2026 → 06/09/2026 (12 weeks)</p>
  </div>
</div>

---

## Project Overview

**Project:** E-commerce Sales Forecasting System on AWS

> Building an end-to-end Machine Learning system on AWS to forecast daily sales for a retail chain (Rossmann dataset, 1M+ records), covering data preprocessing, model training, real-time deployment, monitoring, and pipeline automation.

**Team:** 3 members
| Member | Role |
|--------|------|
| **Huynh Kim Quy** (this report) | Data / ML Engineering |
| Van Thai Quan | Infrastructure / AWS |
| Nguyen Ngoc Sang | Backend / Monitoring |

### 🏆 Model Comparison Results

<div class="model-card-grid">
  <div class="model-card winner-card">
    <span class="badge-pill badge-winner">⭐ Production Selected</span>
    <h3 style="margin-top: 10px; color: #ffffff !important;">XGBoost Baseline</h3>
    <p style="color: #94a3b8; font-size: 0.9rem;">Primary model deployed as REST API to AWS SageMaker Endpoint</p>
    <div class="card-metrics">
      <div>
        <small style="color: #94a3b8;">TEST RMSE</small>
        <div class="metric-number">925.28</div>
      </div>
      <div>
        <small style="color: #94a3b8;">TEST MAPE</small>
        <div class="metric-number">9.92%</div>
      </div>
    </div>
  </div>

  <div class="model-card">
    <span class="badge-pill badge-experiment">Experiment</span>
    <h3 style="margin-top: 10px; color: #ffffff !important;">PyTorch LSTM</h3>
    <p style="color: #94a3b8; font-size: 0.9rem;">Experimental 2-layer Deep Learning time-series forecaster</p>
    <div class="card-metrics">
      <div>
        <small style="color: #94a3b8;">TEST RMSE</small>
        <div class="metric-number" style="color: #cbd5e1;">3,044.43</div>
      </div>
      <div>
        <small style="color: #94a3b8;">TEST MAPE</small>
        <div class="metric-number" style="color: #cbd5e1;">32.79%</div>
      </div>
    </div>
  </div>
</div>

---

## Report Structure

| Section | Content |
|---------|---------|
| **1. Worklog** | Week-by-week activity log (Week 1 → 12) |
| **2. Proposal** | Project proposal, architecture, timeline, risks |
| **3. Blogs Posted** | 3 technical blog posts published on AWS Study Group |
| **4. Events Participated** | AWS events and workshops attended |
| **5. Workshop** | Technical workshop: ML Forecasting Pipeline on AWS |
| **6. Self-evaluation** | Assessment across 8 skill criteria |
| **7. Feedback** | Program feedback and improvement suggestions |
