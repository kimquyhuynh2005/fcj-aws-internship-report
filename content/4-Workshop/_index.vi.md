---
title: "Workshop"
date: 2026-06-06
weight: 4
chapter: false
pre: "<b>4. </b>"
---

# Workshop: Pipeline Dự báo Doanh số trên AWS

## Tổng quan

Trong workshop này, bạn sẽ xây dựng một **pipeline Machine Learning end-to-end hoàn chỉnh** trên AWS để dự báo doanh số bán hàng theo ngày cho chuỗi cửa hàng bán lẻ. Workshop này dựa trên dự án thực tế được thực hiện trong chương trình AWS First Cloud AI Journey.

{{% notice info %}}
**Dự án thực tế:** Workshop này dựa trên công việc thực tế trong 12 tuần thực tập AWS. Tất cả code, kết quả và cấu hình đều từ implementation thực tế — không phải demo hướng dẫn.
{{% /notice %}}

## Những gì bạn sẽ xây dựng

```
Dữ liệu thô (S3)
     │
     ▼
Tiền xử lý dữ liệu & Feature Engineering
     │
     ▼
Train Model XGBoost (local, log lên SageMaker Experiments)
     │
     ▼
Deploy SageMaker Endpoint (ml.t2.medium)
     │
     ▼
AWS Lambda + API Gateway (REST API công khai)
     │
     ▼
CloudWatch Monitoring + Phát hiện Data Drift
```

## AWS Services sử dụng

| Service | Mục đích |
|---------|---------|
| Amazon S3 | Lưu trữ data, model artifacts |
| AWS IAM | Role theo Least Privilege |
| Amazon SageMaker | Deploy model endpoint |
| AWS Lambda | Serverless inference wrapper |
| Amazon API Gateway | REST API công khai |
| Amazon CloudWatch | Dashboard giám sát |

## Mục tiêu học tập

Sau khi hoàn thành workshop, bạn có thể:
- Tiền xử lý và feature engineer dữ liệu time series cho ML
- Train model XGBoost và đánh giá với RMSE/MAPE
- Deploy model lên SageMaker Endpoint bằng boto3
- Xây dựng serverless inference API với Lambda + API Gateway
- Giám sát sức khỏe model và phát hiện data drift

## Thời gian ước tính

| Phần | Thời gian |
|------|----------|
| 1. Tổng quan | 10 phút |
| 2. Chuẩn bị | 15 phút |
| 3. Xử lý dữ liệu | 30 phút |
| 4. Train Model | 30 phút |
| 5. Triển khai & API | 45 phút |
| 6. Dọn dẹp | 10 phút |
| **Tổng** | **~2.5 giờ** |

## Chi phí ước tính

~$2–5 USD (SageMaker Endpoint trong ~1 giờ)

{{% notice warning %}}
**Quan trọng:** Luôn chạy bước Cleanup để xóa SageMaker Endpoint sau khi hoàn thành workshop. Endpoint tính phí theo giờ kể cả khi không có request.
{{% /notice %}}

## Các phần của Workshop

1. [Tổng quan Workshop](5.1-Workshop-overview)
2. [Chuẩn bị](5.2-Prerequiste)
3. [Xử lý dữ liệu](5.3-S3-vpc)
4. [Train Model](5.4-S3-onprem)
5. [Triển khai & API](5.5-Policy)
6. [Dọn dẹp](5.6-Cleanup)