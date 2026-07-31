---
title: "Triển khai Serverless REST API & Live UI Dashboard"
date: 2026-06-06
weight: 5
chapter: false
pre: "<b>5.5. </b>"
---

## Bước 5: Triển khai Endpoint & REST API

### 1. Tạo SageMaker Endpoint

```bash
python week6_deployment/deploy_endpoint.py
```

### 2. Triển khai AWS Lambda Wrapper

```bash
python week6_deployment/deploy_lambda.py
```

### 3. Kiểm thử API thời gian thực

```bash
python week6_deployment/build_real_features.py
```

```
Store: 1 | Ngày dự báo: 2015-06-15
Doanh số THỰC TẾ: 5518.00
Doanh số DỰ BÁO:   5770.64
Sai lệch:          4.58%
✅ PASS — Sai lệch 4.58% nằm trong ngưỡng cho phép (< 15%)
```

---

### 4. Giao diện Dự báo Tương tác Live Dashboard (Production Link)

Nhóm đã triển khai thành công giao diện Web Dashboard tương tác thời gian thực (Dark Mode / Glassmorphism UI) giúp trực quan hóa kết quả dự báo, mô phỏng kịch bản **What-If** và theo dõi biểu đồ xu hướng doanh số 14 ngày.

> 🌐 **Live Production Link:** [https://kimquyhuynh2005.github.io/fcj-aws-internship-report/demo-ui/](https://kimquyhuynh2005.github.io/fcj-aws-internship-report/demo-ui/)

![Retail Sales Forecasting Live Dashboard](/images/demo_dashboard.png)

#### Hướng dẫn chạy Live Dashboard nội bộ:
```powershell
# Khởi chạy Server Backend & UI tại cổng 8000
python demo_ui/server.py
```
Hoặc truy cập trực tiếp đường link Production trực tuyến: **[https://kimquyhuynh2005.github.io/fcj-aws-internship-report/demo-ui/](https://kimquyhuynh2005.github.io/fcj-aws-internship-report/demo-ui/)**
