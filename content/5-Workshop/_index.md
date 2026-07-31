---
title: "Workshop"
date: 2026-06-06
weight: 5
chapter: false
pre: "<b>5. </b>"
---

# Workshop: Pipeline Dự báo Doanh số trên AWS

## Tổng quan

Trang hướng dẫn kỹ thuật này trình bày chi tiết **pipeline Machine Learning end-to-end hoàn chỉnh** được nhóm thực tập triển khai trên AWS để dự báo doanh số bán hàng theo ngày cho chuỗi cửa hàng bán lẻ. Toàn bộ giải pháp được tổng hợp dựa trên kết quả triển khai thực tế của nhóm trong chương trình AWS First Cloud AI Journey.

{{% notice info %}}
**Dự án thực tế:** Workshop này trình bày quy trình triển khai thực tế được nhóm thực hiện trong 8 tuần thực tập AWS. Tất cả mã nguồn, kết quả đánh giá và cấu hình đều từ hệ thống triển khai thực tế của nhóm — không phải ví dụ minh họa lý thuyết.
{{% /notice %}}

## Cấu trúc Kiến trúc Hệ thống

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

## Các Dịch vụ AWS Được Sử Dụng

| Service | Mục đích Triển khai |
|---------|---------------------|
| Amazon S3 | Lưu trữ tập dữ liệu thô và Model Artifacts |
| AWS IAM | Phân quyền bảo mật theo nguyên tắc Least Privilege |
| Amazon SageMaker | Triển khai Real-time Inference Endpoint |
| AWS Lambda | Xử lý logic trung gian Serverless Inference |
| Amazon API Gateway | Cung cấp điểm cuối REST API công khai |
| Amazon CloudWatch | Giám sát vận hành và cảnh báo Data Drift |

## Kết Quả Kỹ Thuật Đạt Được

Hệ thống workshop trình bày chi tiết các bước nhóm đã thực hiện:
- Tiền xử lý và tạo các đặc trưng temporal feature engineering cho dữ liệu chuỗi thời gian
- Huấn luyện mô hình XGBoost và đánh giá định lượng bằng RMSE (`925.28`) và MAPE (`9.92%`)
- Triển khai mô hình lên SageMaker Endpoint bằng SDK `boto3`
- Xây dựng kiến trúc Serverless Inference API với AWS Lambda và API Gateway
- Cấu hình hệ thống giám sát sức khỏe mô hình và phát hiện sai lệch dữ liệu (data drift) qua CloudWatch

## Thời Gian Triển khai Mô Hình

| Phần Kỹ Thuật | Thời Gian Thực Hiện |
|---------------|---------------------|
| 1. Tổng quan kiến trúc | 10 phút |
| 2. Môi trường chuẩn bị | 15 phút |
| 3. Xử lý & Tạo đặc trưng | 30 phút |
| 4. Huấn luyện mô hình | 30 phút |
| 5. Triển khai Endpoint & API | 45 phút |
| 6. Xóa tài nguyên | 10 phút |
| **Tổng cộng** | **~2.5 giờ** |

## Chi Phí Triển Khai Thực Tế

~$2–5 USD (Duy trì SageMaker Endpoint trong ~1 giờ thử nghiệm)

{{% notice warning %}}
**Lưu ý vận hành:** Nhóm luôn thực hiện quy trình Cleanup để dọn dẹp SageMaker Endpoint sau khi hoàn tất kiểm thử nhằm tối ưu hóa chi phí tài nguyên AWS.
{{% /notice %}}

## Các Nội Dung Chi Tiết Của Workshop

1. [Tổng quan Workshop](5.1-Workshop-overview)
2. [Môi trường chuẩn bị](5.2-Prerequiste)
3. [Xử lý dữ liệu](5.3-S3-vpc)
4. [Huấn luyện Mô hình](5.4-S3-onprem)
5. [Triển khai Endpoint & API](5.5-Policy)
6. [Dọn dẹp tài nguyên](5.6-Cleanup)