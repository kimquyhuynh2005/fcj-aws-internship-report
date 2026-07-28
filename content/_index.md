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

&emsp; **Full Name:** Huynh Kim Quy

&emsp; **Phone Number:** 0911263926

&emsp; **Email:** kimquyhuynh2005@gmail.com

&emsp; **University:** Ho Chi Minh City University of Technology (HCMUT)

&emsp; **Major:** Computer Science

&emsp; **Class:** AWS062026

&emsp; **Internship Company:** Amazon Web Services Viet Nam Company Limited

&emsp; **Internship Position:** Workforce Bootcamp — First Cloud AI Journey

&emsp; **Internship Duration:** 06/06/2026 → 06/09/2026 (12 weeks)

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
