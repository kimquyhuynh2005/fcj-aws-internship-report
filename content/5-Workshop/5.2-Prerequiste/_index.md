---
title: "Prerequisites & AWS Account Setup"
date: 2026-06-06
weight: 2
chapter: false
pre: "<b>5.2. </b>"
---

## Prerequisites

### AWS Account Requirements

{{% notice warning %}}
Check your SageMaker service quotas **before** starting. This workshop requires SageMaker Endpoint quota ≥ 1. If your quota is 0, see the workaround section below.
{{% /notice %}}

#### Check Your Quotas

```bash
# Install quota checker
pip install boto3

# Check SageMaker Endpoint quota
aws service-quotas get-service-quota \
  --service-code sagemaker \
  --quota-code L-65C4BD00 \
  --region ap-southeast-1
```

#### Required Quotas

| Resource | Required | Check |
|----------|---------|-------|
| SageMaker Endpoints | ≥ 1 | Service Quotas → SageMaker |
| Lambda functions | ≥ 1 | Usually in free tier |
| S3 buckets | ≥ 1 | Usually no limit |

### Required Permissions (IAM)

Create an IAM Role with these permissions:

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

### Local Environment Setup

```powershell
# 1. Clone the project
git clone https://github.com/YOUR-USERNAME/aws-internship-ML-forecasting.git
cd aws-internship-ML-forecasting

# 2. Create virtual environment
python -m venv venv
.\venv\Scripts\activate    # Windows
# source venv/bin/activate  # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure AWS CLI
aws configure
# or for SSO:
aws configure sso

# 5. Verify setup
python verify_setup.py
```

### `requirements.txt`

```
boto3>=1.26.0
pandas>=1.5.0
numpy>=1.23.0
xgboost==1.7.6
torch>=1.13.0
scikit-learn>=1.1.0
shap>=0.41.0
```

{{% notice info %}}
**Version Note:** `xgboost==1.7.6` is pinned to exactly this version. The SageMaker container uses this version for serving. A mismatch causes ModelError 500.
{{% /notice %}}

### Download Dataset

```python
# Download Rossmann Store Sales from Kaggle
# (requires Kaggle API key in ~/.kaggle/kaggle.json)
pip install kaggle
kaggle competitions download -c rossmann-store-sales
unzip rossmann-store-sales.zip -d data/raw/
```

Or download manually from: [Kaggle Rossmann Store Sales](https://www.kaggle.com/c/rossmann-store-sales)

### S3 Bucket Setup

```bash
# Create bucket
aws s3 mb s3://your-ml-forecasting-bucket --region ap-southeast-1

# Upload raw data
aws s3 cp data/raw/train.csv s3://your-ml-forecasting-bucket/ml-forecasting/data/raw/
aws s3 cp data/raw/store.csv s3://your-ml-forecasting-bucket/ml-forecasting/data/raw/
```

### Update `config.py`

```python
# config.py — update with your settings
BUCKET_NAME = "your-ml-forecasting-bucket"
REGION = "ap-southeast-1"
PREFIX = "ml-forecasting"

S3_RAW_DATA = f"s3://{BUCKET_NAME}/{PREFIX}/data/raw/"
S3_PROCESSED_DATA = f"s3://{BUCKET_NAME}/{PREFIX}/data/processed/"
S3_MODEL_ARTIFACTS = f"s3://{BUCKET_NAME}/{PREFIX}/models/artifacts/"
SAGEMAKER_ROLE_ARN = "arn:aws:iam::YOUR-ACCOUNT-ID:role/SageMaker-ExecutionRole"
```

### Workaround: If SageMaker Endpoint Quota = 0

If you encounter quota issues (as the team did), you have two options:
1. **Request quota increase** via AWS Support (takes 1–3 business days)
2. **Use a personal AWS account** with fresh quota (immediate)

The team used option 2 during Week 6 — this is a valid solution for a bootcamp setting.