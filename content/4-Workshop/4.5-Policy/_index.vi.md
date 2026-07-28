---
title: "5. Triển khai & REST API"
date: 2026-06-06
weight: 5
chapter: false
pre: "<b>4.5. </b>"
---

## Bước 5: Triển khai Endpoint & REST API Công khai

### Kiến trúc Luồng Triển khai Serverless

```text
Người dùng / Client → Amazon API Gateway → AWS Lambda → SageMaker Endpoint → XGBoost Model
```

---

### Bước 5.1: Xây dựng Script Phục vụ Dự báo (`inference.py`)

File này được đóng gói cùng artifact của model để SageMaker gọi khi nhận request dự báo:

```python
import os
import json
import pickle
import pandas as pd

FEATURES = [
    'Store', 'DayOfWeek', 'Year', 'Month', 'Day', 'WeekOfYear',
    'DayOfYear', 'IsWeekend', 'IsDecember', 'Promo', 'StateHoliday',
    'SchoolHoliday', 'StoreType', 'Assortment', 'CompetitionDistance',
    'Promo2', 'rolling_mean_7', 'rolling_mean_14', 'rolling_mean_30',
    'lag_1', 'lag_7', 'lag_14'
]

def model_fn(model_dir):
    """Load model từ file pickle"""
    model_path = os.path.join(model_dir, 'xgboost_model.pkl')
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    return model

def input_fn(request_body, content_type):
    """Chuyển đổi dữ liệu JSON đầu vào thành DataFrame"""
    if content_type == 'application/json':
        data = json.loads(request_body)
        return pd.DataFrame([data])
    raise ValueError(f"Kiểu dữ liệu không hỗ trợ: {content_type}")

def predict_fn(input_data, model):
    """Dự báo doanh số trực tiếp từ mô hình XGBoost"""
    X = input_data[FEATURES]
    predictions = model.predict(X)
    return predictions

def output_fn(prediction, accept):
    """Trả về kết quả JSON cho client"""
    return json.dumps({'predicted_sales': prediction.tolist()})
```

---

### Bước 5.2: Triển khai SageMaker Endpoint (`deploy_endpoint.py`)

```python
import boto3
import sagemaker

REGION = 'ap-southeast-1'
BUCKET = 'quanvan-ml-forecasting-2026'
ROLE_ARN = 'arn:aws:iam::897355252080:role/SageMaker-ExecutionRole-QuanVan'
MODEL_S3 = f's3://{BUCKET}/ml-forecasting/models/artifacts/xgboost_model_with_code.tar.gz'

sm_client = boto3.client('sagemaker', region_name=REGION)
model_name = 'rossmann-xgboost-model'
endpoint_config_name = 'rossmann-endpoint-config'
endpoint_name = 'rossmann-forecasting-endpoint'

# 1. Lấy URI Container XGBoost 1.7
image_uri = sagemaker.image_uris.retrieve(
    framework='xgboost',
    region=REGION,
    version='1.7-1'
)

# 2. Tạo SageMaker Model
sm_client.create_model(
    ModelName=model_name,
    PrimaryContainer={
        'Image': image_uri,
        'ModelDataUrl': MODEL_S3,
        'Environment': {
            'SAGEMAKER_PROGRAM': 'inference.py',
            'SAGEMAKER_SUBMIT_DIRECTORY': MODEL_S3
        }
    },
    ExecutionRoleArn=ROLE_ARN
)

# 3. Tạo Endpoint Config (Serverless instance ml.t2.medium)
sm_client.create_endpoint_config(
    EndpointConfigName=endpoint_config_name,
    ProductionVariants=[{
        'VariantName': 'AllTraffic',
        'ModelName': model_name,
        'InitialInstanceCount': 1,
        'InstanceType': 'ml.t2.medium',
        'InitialVariantWeight': 1.0
    }]
)

# 4. Triển khai Endpoint
sm_client.create_endpoint(
    EndpointName=endpoint_name,
    EndpointConfigName=endpoint_config_name
)

print(f"🚀 Đang khởi tạo Endpoint: {endpoint_name}...")
```

---

### Bước 5.3: AWS Lambda Wrapper (`lambda_function.py`)

```python
import json
import boto3

runtime = boto3.client('sagemaker-runtime', region_name='ap-southeast-1')
ENDPOINT_NAME = 'rossmann-forecasting-endpoint'

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}')) if 'body' in event else event
        
        response = runtime.invoke_endpoint(
            EndpointName=ENDPOINT_NAME,
            ContentType='application/json',
            Body=json.dumps(body)
        )
        
        result = json.loads(response['Body'].read().decode())
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps(result)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

---

### Bước 5.4: Gọi thử nghiệm REST API Công khai bằng Curl

```bash
curl -X POST https://your-api-id.execute-api.ap-southeast-1.amazonaws.com/prod/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "Store": 1,
    "DayOfWeek": 1,
    "Year": 2015,
    "Month": 6,
    "Day": 15,
    "WeekOfYear": 25,
    "DayOfYear": 166,
    "IsWeekend": 0,
    "IsDecember": 0,
    "Promo": 1,
    "StateHoliday": 0,
    "SchoolHoliday": 0,
    "StoreType": 2,
    "Assortment": 0,
    "CompetitionDistance": 1270,
    "Promo2": 0,
    "rolling_mean_7": 5420.5,
    "rolling_mean_14": 5380.2,
    "rolling_mean_30": 5210.8,
    "lag_1": 5510.0,
    "lag_7": 5300.0,
    "lag_14": 5120.0
  }'
```

**Kết quả Trả về:**
```json
{
  "predicted_sales": [5301.91]
}
```
> **Đánh giá kiểm thử:** Giá trị thực tế ngày 15/06/2015 của Cửa hàng 1 là **5,589 USD**. Sai lệch của API dự báo chỉ là **5.14%** (Đạt Quality Gate < 15%).
