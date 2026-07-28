---
title: "Tuần 6 — Triển khai + REST API"
date: 2026-07-11
weight: 6
chapter: false
pre: "<b>1.6. </b>"
---

## Tuần 6 — Triển khai + REST API ✅

**Người thực hiện:** Văn Thái Quân | **Thời gian:** 11/07/2026 – 17/07/2026

---

### Bối cảnh
Account nhóm (119505195050) bị block quota SageMaker Endpoint = 0. Văn Thái Quân chủ động dùng account AWS cá nhân (897355252080) với hạ tầng độc lập hoàn toàn.

### Công việc đã làm

1. **Setup hạ tầng AWS riêng (account cá nhân)**
   - S3 Bucket mới: `quanvan-ml-forecasting-2026`
   - IAM Role mới: `SageMaker-ExecutionRole-QuanVan` với Inline Policy tùy chỉnh
   - Chạy lại preprocessing và training để tạo artifacts trên account mới

2. **Deploy SageMaker Endpoint**
   - Dùng boto3 thuần — không dùng SageMaker SDK (SDK 3.x bị lỗi)
   - Đóng gói model: `xgboost_model.pkl` + `inference.py` → `model.tar.gz`
   - Instance type: `ml.t2.medium`

3. **Debug 3 lỗi thực tế**

| Lỗi | Nguyên nhân | Cách xử lý |
|-----|------------|-----------|
| ValidationException | Container image URI sai region | Lấy đúng URI qua `sagemaker.image_uris.retrieve()` |
| ModelError 500 | XGBoost version lệch train vs serve | Downgrade xuống 1.7.6, train lại |
| Kết quả Infinity | Thừa `np.expm1()` trong inference.py | Bỏ dòng đó, trả thẳng `model.predict(X)` |

4. **Xây dựng Lambda + API Gateway**
   - `lambda_function.py`: nhận request → gọi Endpoint → trả response
   - `deploy_lambda.py`: IaC script tự động deploy Lambda
   - API Gateway: REST API, `/forecast` POST, Lambda Proxy, stage `prod`

5. **Validate bằng dữ liệu lịch sử thật**
   - `build_real_features.py`: tính 22 features từ lịch sử thật (không data leakage)
   - MAPE_THRESHOLD = 15% làm quality gate tự động

---

### Kết quả đạt được

| Hạng mục | Kết quả |
|---------|---------|
| SageMaker Endpoint | InService — ml.t2.medium (366.6s) ✅ |
| Smoke test (boto3) | `predicted_sales: 5301.91` ✅ |
| Validate dữ liệu thật | Store 1, 2015-06-15: **sai lệch 5.14%** ✅ |
| Lambda function | statusCode 200, Duration ~2.4s ✅ |
| REST API (curl) | `{"predicted_sales": [5301.91]}` ✅ |
---

### 💻 Code Snippet Nổi bật

#### 1. Triển khai Endpoint bằng Boto3 (`deploy_endpoint.py`)
```python
import boto3
import sagemaker

sm_client = boto3.client('sagemaker', region_name='ap-southeast-1')

# Lấy container image URI chính xác cho XGBoost 1.7-1
image_uri = sagemaker.image_uris.retrieve(
    framework='xgboost',
    region='ap-southeast-1',
    version='1.7-1'
)

# 1. Create Model
sm_client.create_model(
    ModelName='rossmann-xgboost-model',
    PrimaryContainer={
        'Image': image_uri,
        'ModelDataUrl': 's3://quanvan-ml-forecasting-2026/ml-forecasting/models/artifacts/xgboost_model_with_code.tar.gz'
    },
    ExecutionRoleArn='arn:aws:iam::897355252080:role/SageMaker-ExecutionRole-QuanVan'
)

# 2. Create Endpoint Config & Endpoint
sm_client.create_endpoint_config(
    EndpointConfigName='rossmann-endpoint-config',
    ProductionVariants=[{
        'VariantName': 'AllTraffic',
        'ModelName': 'rossmann-xgboost-model',
        'InitialInstanceCount': 1,
        'InstanceType': 'ml.t2.medium'
    }]
)
sm_client.create_endpoint(
    EndpointName='rossmann-forecasting-endpoint',
    EndpointConfigName='rossmann-endpoint-config'
)
```

#### 2. Serverless Lambda Proxy Handler (`lambda_function.py`)
```python
import json
import boto3

runtime = boto3.client('sagemaker-runtime', region_name='ap-southeast-1')

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}')) if 'body' in event else event
    
    response = runtime.invoke_endpoint(
        EndpointName='rossmann-forecasting-endpoint',
        ContentType='application/json',
        Body=json.dumps(body)
    )
    result = json.loads(response['Body'].read().decode())
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(result)
    }
```
**API Endpoint:**
```
https://81nxjqyb91.execute-api.ap-southeast-1.amazonaws.com/prod/forecast
```

---

### Bài học rút ra
- Luôn dùng `sagemaker.image_uris.retrieve()` để lấy container URI đúng region
- Pin XGBoost version và đồng bộ giữa môi trường train và serve
- Không dùng `np.expm1()` nếu target không được log-transform khi train
- IaC cho Lambda deployment tiết kiệm thời gian và có thể lặp lại
