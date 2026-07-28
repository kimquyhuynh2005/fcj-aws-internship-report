---
title: "Đề xuất dự án"
date: 2026-06-06
weight: 2
chapter: false
pre: "<b>2. </b>"
---

# Đề xuất dự án: Dự báo Doanh số Thương mại Điện tử trên AWS

## 1. Tổng quan dự án

Dự án xây dựng hệ thống **Machine Learning end-to-end hoàn chỉnh** trên nền tảng AWS, giải quyết bài toán dự báo doanh số bán hàng theo ngày cho chuỗi cửa hàng bán lẻ. Hệ thống bao gồm toàn bộ vòng đời: tiền xử lý dữ liệu, huấn luyện mô hình, triển khai API, giám sát tự động và tự động hoá pipeline.

**Dataset:** Rossmann Store Sales (Kaggle) — 1,017,209 bản ghi, 1,115 cửa hàng, 942 ngày (2013–2015)

---

## 2. Mục tiêu

### Mục tiêu kỹ thuật
- Xây dựng và so sánh hai mô hình: **XGBoost** (baseline) và **PyTorch LSTM**
- Triển khai model lên SageMaker Endpoint và expose qua REST API công khai
- Thiết lập hệ thống giám sát phát hiện data drift tự động bằng CloudWatch
- Tự động hoá toàn bộ workflow bằng SageMaker Pipelines (IaC)

### Mục tiêu học thuật
- Làm quen với hệ sinh thái AWS ML: SageMaker, S3, Lambda, API Gateway, CloudWatch
- Áp dụng ML engineering best practices: versioning, experiment tracking, model registry
- Hiểu rõ sự khác biệt giữa train local và production ML system trên cloud

---

## 3. Vấn đề cần giải quyết

### Bài toán
Dự báo doanh số bán hàng **theo ngày** cho 1,115 cửa hàng bán lẻ, dựa trên dữ liệu lịch sử, khuyến mãi, ngày lễ và các yếu tố ngoại sinh. Đây là bài toán **time series regression**.

### Tại sao quan trọng?
| Vấn đề thực tế | Tác động nếu không có dự báo |
|---------------|-------------------------------|
| Tồn kho | Thiếu hàng hoặc tồn kho dư thừa → lãng phí chi phí |
| Nhân sự | Sắp lịch không hợp lý → tăng chi phí vận hành |
| Marketing | Phân bổ ngân sách sai thời điểm → ROI thấp |
| Bất thường | Không phát hiện sớm xu hướng bất thường → mất doanh thu |

---

## 4. Kiến trúc giải pháp

![Sơ đồ Kiến trúc Hệ thống AWS Chi tiết](/images/2-Proposal/aws_architecture.png)

```
Dữ liệu thô (Rossmann CSV) → Amazon S3
         │
         ▼
SageMaker Processing Job
(Feature Engineering: rolling_mean, lag features, date features)
         │
    ┌────┴────┐
    ▼         ▼
XGBoost    PyTorch LSTM
Training   Training
    │         │
    └────┬────┘
         ▼
SageMaker Experiments (so sánh RMSE, MAPE)
         │
         ▼
SageMaker Model Registry (versioning + approval)
         │
         ▼
SageMaker Endpoint (ml.t2.medium, real-time inference)
         │
         ▼
AWS Lambda + API Gateway (REST API công khai)
         │
         ▼
Custom Drift Monitor + CloudWatch Dashboard
         │
         ▼
SageMaker Pipelines (tự động hoá end-to-end)
```

### AWS Services sử dụng

| Service | Mục đích |
|---------|---------|
| Amazon S3 | Lưu trữ data, model artifacts, logs |
| AWS IAM | Role và policy theo Least Privilege |
| SageMaker Experiments | Tracking và so sánh experiments |
| SageMaker Endpoint | Real-time inference (ml.t2.medium) |
| AWS Lambda | Serverless wrapper cho inference |
| Amazon API Gateway | Expose REST API công khai |
| Amazon CloudWatch | Metrics, logs, alerts, dashboard |
| SageMaker Pipelines | Tự động hoá workflow end-to-end |

---

## 5. Timeline

| Tuần | Mục tiêu | Kết quả |
|------|---------|---------|
| **1** | Setup môi trường AWS | IAM Role, S3 bucket, config.py ✅ |
| **2** | Tiền xử lý dữ liệu & EDA | Processed data trên S3, train/val/test split ✅ |
| **3** | XGBoost baseline + LSTM skeleton | XGBoost artifact, RMSE 925.28, MAPE 9.92% ✅ |
| **4** | Train PyTorch LSTM | LSTM artifact, so sánh với XGBoost ✅ |
| **5** | Model Registry + SHAP | Models registered, SHAP feature importance ✅ |
| **6** | Triển khai + REST API | REST API live, sai lệch 5.14% ✅ |
| **7** | Monitoring + Drift Detection | CloudWatch Dashboard, phát hiện drift ✅ |
| **8** | Pipeline + Refactor | SageMaker Pipeline IaC, local orchestration ✅ |
| **9–12** | Tài liệu & Báo cáo | Website này & Đóng gói Kiến trúc AWS ✅ |

![Sơ đồ Kiến trúc Tổng thể AWS Dự án hoàn thiện (Tuần 9-12)](/images/2-Proposal/aws_architecture.png)

---

## 6. Phân công nhóm

| Vai trò | Trách nhiệm |
|---------|------------|
| **A — Data/ML** (Huỳnh Kim Quý) | Data pipeline, code XGBoost & LSTM, phân tích SHAP |
| **B — Infra/AWS** (Văn Thái Quân) | Triển khai, SageMaker Endpoint, Pipeline IaC |
| **C — Backend/API** (Nguyễn Ngọc Sáng) | Lambda, API Gateway, monitoring CloudWatch |

---

## 7. Kết quả kỳ vọng vs Thực tế

| Model | MAPE kỳ vọng | MAPE thực tế | RMSE kỳ vọng | RMSE thực tế |
|-------|-------------|-------------|-------------|-------------|
| **XGBoost** | ~15% | **9.92%** ✅ | ~1,200 | **925.28** ✅ |
| LSTM | ~12% | 32.79% ❌ | ~1,000 | 3,044.43 ❌ |

> **Kết luận:** XGBoost vượt xa kỳ vọng. LSTM kém hơn do thiếu chuẩn hoá và độ dài chuỗi quá ngắn — đây là bài học thực tiễn có giá trị.

---

## 8. Ngân sách ước tính

| Service | Sử dụng | Chi phí ước tính |
|---------|---------|-----------------|
| SageMaker Endpoint | ~2 tuần, ml.t2.medium | ~$2 |
| S3 Storage | ~5 GB | ~$0.10 |
| Lambda + API Gateway | Trong free tier | $0 |
| **Tổng** | | **~$2–5** |

> Lưu ý: SageMaker Training Jobs quota = 0 trên account nhóm. Train model thực hiện local, giảm đáng kể chi phí cloud.

---

## 9. Đánh giá rủi ro

| Rủi ro | Khả năng | Biện pháp xử lý |
|--------|---------|----------------|
| SageMaker quota = 0 | **Đã xảy ra** | Train local, dùng account cá nhân để deploy |
| LSTM kém hơn XGBoost | Đã xảy ra | Chuyển thành nghiên cứu so sánh — vẫn có giá trị |
| Data leakage trong preprocessing | Thấp | Fit scaler chỉ trên train set, split theo thứ tự thời gian |
| XGBoost version conflict | Đã xảy ra | Pin version 1.7.6, đồng bộ train và serve |
| Không có data mới để monitor | Chắc chắn | Viết `drift_simulator.py` mô phỏng drift |