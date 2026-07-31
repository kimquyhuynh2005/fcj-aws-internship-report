---
title: "Serverless REST API & Live UI Dashboard Deployment"
date: 2026-06-06
weight: 5
chapter: false
pre: "<b>5.5. </b>"
---

## Step 5: Endpoint & REST API Deployment

### 1. Create SageMaker Endpoint

```bash
python week6_deployment/deploy_endpoint.py
```

### 2. Deploy AWS Lambda Wrapper

```bash
python week6_deployment/deploy_lambda.py
```

### 3. Real-Time API Verification

```bash
python week6_deployment/build_real_features.py
```

```
Store: 1 | Target Date: 2015-06-15
ACTUAL Sales:    5518.00
PREDICTED Sales: 5770.64
Error Delta:     4.58%
✅ PASS — Error delta 4.58% meets target accuracy (< 15.0%)
```

---

### 4. Interactive Live Forecast Web Dashboard (Production Link)

Our team successfully deployed a real-time Interactive Web Forecast Dashboard featuring a modern Dark Mode / Glassmorphism UI to visualize daily predictions, simulate **What-If** scenarios, and display 14-day sales trend charts.

> 🌐 **Live Production Link:** [https://kimquyhuynh2005.github.io/fcj-aws-internship-report/demo-ui/](https://kimquyhuynh2005.github.io/fcj-aws-internship-report/demo-ui/)

![Retail Sales Forecasting Live Dashboard](/images/demo_dashboard.png)

#### Running the Live Dashboard locally:
```powershell
# Start the Python HTTP Server & UI on port 8000
python demo_ui/server.py
```
Or access the live production web app directly online at: **[https://kimquyhuynh2005.github.io/fcj-aws-internship-report/demo-ui/](https://kimquyhuynh2005.github.io/fcj-aws-internship-report/demo-ui/)**
