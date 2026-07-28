---
title: "Yêu cầu Tiền đề & Cấu hình AWS Credentials"
date: 2026-06-06
weight: 2
chapter: false
pre: "<b>5.2. </b>"
---

## Các điều kiện chuẩn bị

### Yêu cầu Tài khoản AWS

{{% notice warning %}}
Kiểm tra Service Quotas SageMaker **trước khi** bắt đầu. Workshop này yêu cầu quota SageMaker Endpoint ≥ 1.
{{% /notice %}}

#### Các quyền IAM bắt buộc

Tạo IAM Role với các quyền tối thiểu:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject", "s3:PutObject", "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "sagemaker:CreateModel",
        "sagemaker:CreateEndpointConfig",
        "sagemaker:CreateEndpoint",
        "sagemaker:InvokeEndpoint",
        "sagemaker:DeleteEndpoint",
        "sagemaker:DeleteEndpointConfig",
        "sagemaker:DeleteModel"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["lambda:*", "apigateway:*", "cloudwatch:*", "logs:*"],
      "Resource": "*"
    }
  ]
}
```

### Khởi tạo Môi trường Local

```powershell
# 1. Clone dự án
git clone https://github.com/YOUR-USERNAME/aws-internship-ML-forecasting.git
cd aws-internship-ML-forecasting

# 2. Tạo môi trường ảo (virtualenv)
python -m venv venv
.\venv\Scripts\activate    # Windows

# 3. Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt

# 4. Kiểm tra cấu hình môi trường
python verify_setup.py
```

### Cấu hình `config.py`

```python
# config.py — Cập nhật thông tin tài khoản của bạn
BUCKET_NAME = "aws-internship-hkq-2026"
REGION = "ap-southeast-1"
PREFIX = "ml-forecasting"

S3_RAW_DATA = f"s3://{BUCKET_NAME}/{PREFIX}/data/raw/"
S3_PROCESSED_DATA = f"s3://{BUCKET_NAME}/{PREFIX}/data/processed/"
S3_MODEL_ARTIFACTS = f"s3://{BUCKET_NAME}/{PREFIX}/models/artifacts/"
SAGEMAKER_ROLE_ARN = "arn:aws:iam::119505195050:role/SageMaker-ExecutionRole-hkq"
```
