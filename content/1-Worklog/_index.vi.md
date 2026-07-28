---
title: "Nhật ký công việc"
date: 2026-06-06
weight: 1
chapter: false
pre: "<b>1. </b>"
---

# Nhật ký công việc — Dự án AWS ML Internship

> **Nhóm thực hiện:** Huỳnh Kim Quý (Data/ML) · Văn Thái Quân (Infra/AWS) · Nguyễn Ngọc Sáng (Backend/API)  
> **Thời gian:** 8 tuần  
> **Trạng thái:** Hoàn thành ✅

---

## Thông tin Hạ tầng AWS

| Hạng mục | Tài khoản Nhóm (Tuần 1–5) | Tài khoản Quân (Tuần 6–8) |
|---|---|---|
| Account ID | `119505195050` | `897355252080` |
| Region | `ap-southeast-1` | `ap-southeast-1` |
| S3 Bucket | `s3://aws-internship-hkq-2026` | `s3://quanvan-ml-forecasting-2026` |
| IAM Role | `SageMaker-ExecutionRole-hkq` | `SageMaker-ExecutionRole-QuanVan` |

---

## Các Giải pháp Thay thế (Workarounds)

| Dịch vụ bị giới hạn Quota | Giải pháp thay thế áp dụng | Tuần |
|---|---|---|
| SageMaker Training Jobs (quota = 0) | Train local, log metrics qua boto3 | 3–4 |
| SageMaker Model Registry (quota = 0) | Lưu metadata JSON lên S3 | 5 |
| SageMaker SDK 3.x lỗi | Dùng `boto3.client()` trực tiếp | Xuyên suốt |
| AWS CLI multipart upload lỗi | Dùng `boto3.upload_file()` | 2 |
| SageMaker Endpoint (quota = 0 tài khoản nhóm) | Dùng tài khoản cá nhân của Quân | 6 |
| SageMaker Pipelines (quota = 0) | Script điều phối local (`simple_orchestration.py`) | 8 |

---

## Bảng Tổng hợp Hoạt động Theo Tuần

| Tuần | Chủ đề | Phụ trách chính | Kết quả đạt được |
|------|--------|-----------------|------------------|
| [Tuần 1](1.1-week1/) | Khởi tạo Môi trường AWS | Huỳnh Kim Quý | `config.py`, `verify_setup.py`, tạo S3 bucket |
| [Tuần 2](1.2-week2/) | Tiền xử lý Dữ liệu & EDA | Huỳnh Kim Quý | `preprocessing.py`, `train.csv`, `val.csv`, `test.csv` |
| [Tuần 3](1.3-week3/) | Baseline XGBoost & Khung LSTM | Huỳnh Kim Quý | `train_xgboost.py` (RMSE 925.28), khung `model.py` |
| [Tuần 4](1.4-week4/) | Huấn luyện PyTorch LSTM | Huỳnh Kim Quý | `train_lstm.py` (RMSE 3044.43), chọn XGBoost |
| [Tuần 5](1.5-week5/) | Quản lý Model Registry & SHAP | Huỳnh Kim Quý | `shap_analysis.py`, `model_registry.py` (JSON S3) |
| [Tuần 6](1.6-week6/) | Triển khai Endpoint & REST API | Văn Thái Quân | `deploy_endpoint.py`, `deploy_lambda.py` (API live) |
| [Tuần 7](1.7-week7/) | Giám sát & Drift Detection | Nguyễn Ngọc Sáng | `drift_simulator.py`, `CloudWatch Dashboard` |
| [Tuần 8](1.8-week8/) | Tự động hóa Pipeline & Refactor | Văn Thái Quân | `pipeline_definition.py`, `simple_orchestration.py` |