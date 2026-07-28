---
title: "Serverless REST API & Live UI Dashboard Deployment"
date: 2026-06-06
weight: 5
chapter: false
pre: "<b>5.5. </b>"
---

## Step 5: Deployment & REST API

### Architecture

```
Internet → API Gateway → Lambda → SageMaker Endpoint → XGBoost Model
```

### Step 5.1: Create `inference.py`

This file goes inside the model package and is called by SageMaker for every prediction request.

```python
# inference.py (production version)
import os
import json
import pickle
import numpy as np
import pandas as pd

FEATURES = [
    'Store', 'DayOfWeek', 'Year', 'Month', 'Day', 'WeekOfYear',
    'DayOfYear', 'IsWeekend', 'IsDecember', 'Promo', 'StateHoliday',
    'SchoolHoliday', 'StoreType', 'Assortment', 'CompetitionDistance',
    'Promo2', 'rolling_mean_7', 'rolling_mean_14', 'rolling_mean_30',
    'lag_1', 'lag_7', 'lag_14'
]

def model_fn(model_dir):
    model_path = os.path.join(model_dir, 'xgboost_model.pkl')
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    return model

def input_fn(request_body, content_type):
    if content_type == 'application/json':
        data = json.loads(request_body)
        return pd.DataFrame([data])
    raise ValueError(f"Unsupported content type: {content_type}")

def predict_fn(input_data, model):
    X = input_data[FEATURES] if all(f in input_data.columns for f in FEATURES) else input_data
    # NOTE: No np.expm1() — model was trained on raw Sales values
    predictions = model.predict(X)
    return predictions

def output_fn(prediction, accept):
    return json.dumps({'predicted_sales': prediction.tolist()})
```

{{% notice warning %}}
**Common Mistake:** Do NOT add `np.expm1()` in `predict_fn` unless you explicitly log-transformed the target during training. The actual inference error we encountered was caused by this exact mistake — producing Infinity values.
{{% /notice %}}

### Step 5.2: Deploy SageMaker Endpoint

```python
# deploy_endpoint.py
import boto3
import sagemaker

REGION = 'ap-southeast-1'
BUCKET = 'your-ml-forecasting-bucket'
ROLE_ARN = 'arn:aws:iam::YOUR-ACCOUNT-ID:role/SageMaker-ExecutionRole'
MODEL_S3 = f's3://{BUCKET}/ml-forecasting/models/artifacts/xgboost_model_with_code.tar.gz'

sm_client = boto3.client('sagemaker', region_name=REGION)
model_name = 'rossmann-xgboost-model'
endpoint_config_name = 'rossmann-endpoint-config'
endpoint_name = 'rossmann-forecasting-endpoint'

# Get correct container image URI for XGBoost 1.7
image_uri = sagemaker.image_uris.retrieve(
    framework='xgboost',
    region=REGION,
    version='1.7-1'
)
print(f"Image URI: {image_uri}")

# Create Model
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

# Create Endpoint Config
sm_client.create_endpoint_config(
    EndpointConfigName=endpoint_config_name,
    ProductionVariants=[{
        'VariantName': 'AllTraffic',
        'ModelName': model_name,
        'InstanceType': 'ml.t2.medium',
        'InitialInstanceCount': 1
    }]
)

# Create Endpoint
sm_client.create_endpoint(
    EndpointName=endpoint_name,
    EndpointConfigName=endpoint_config_name
)

# Wait for endpoint to be InService
print("Waiting for endpoint... (usually ~5 minutes)")
waiter = sm_client.get_waiter('endpoint_in_service')
waiter.wait(EndpointName=endpoint_name)
print("Endpoint is InService ✅")
```

### Step 5.3: Test the Endpoint Directly

```python
# invoke_test.py
import boto3, json

runtime = boto3.client('sagemaker-runtime', region_name='ap-southeast-1')

test_input = {
    "Store": 1, "DayOfWeek": 3, "Year": 2015, "Month": 6, "Day": 15,
    "WeekOfYear": 25, "DayOfYear": 166, "IsWeekend": 0, "IsDecember": 0,
    "Promo": 1, "StateHoliday": 0, "SchoolHoliday": 0,
    "StoreType": 2, "Assortment": 0, "CompetitionDistance": 1270.0,
    "Promo2": 0, "rolling_mean_7": 5400.0, "rolling_mean_14": 5350.0,
    "rolling_mean_30": 5200.0, "lag_1": 5500.0, "lag_7": 5300.0, "lag_14": 5250.0
}

response = runtime.invoke_endpoint(
    EndpointName='rossmann-forecasting-endpoint',
    ContentType='application/json',
    Body=json.dumps(test_input)
)

result = json.loads(response['Body'].read().decode())
print(f"Predicted sales: {result['predicted_sales']}")
# Output: Predicted sales: [5301.91]
```

### Step 5.4: Deploy Lambda + API Gateway

```python
# lambda_function.py
import json
import boto3

ENDPOINT_NAME = 'rossmann-forecasting-endpoint'
runtime = boto3.client('sagemaker-runtime', region_name='ap-southeast-1')

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
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
        return {'statusCode': 500, 'body': json.dumps({'error': str(e)})}
```

### Step 5.5: Call the Public API

```bash
curl -X POST \
  https://YOUR-API-ID.execute-api.ap-southeast-1.amazonaws.com/prod/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "Store": 1, "DayOfWeek": 3, "Promo": 1,
    "rolling_mean_14": 5350.0, "lag_7": 5300.0
  }'

# Expected Response:
# {"predicted_sales": [5301.91]}
```

### Validation Results

```
Store: 1 | Date: 2015-06-15
Actual Sales:    5,518.00
Predicted Sales: 5,801.69  (via API)
Error:           5.14%  ✅ PASS (threshold: 15%)
```

---

### Step 5.6: Interactive ML Forecast Live Dashboard (UI Demo)

The team developed a real-time Interactive Web Forecast Dashboard featuring a modern Dark Mode / Glassmorphism UI to visualize daily predictions, simulate **What-If** scenarios, and display 14-day sales trend charts.

![Retail Sales Forecasting Live Dashboard](/images/demo_dashboard.png)

#### Running the Live Dashboard:
```powershell
# Start the Python HTTP Server & UI on port 8000
python demo_ui/server.py
```
Open your browser and navigate to: **http://localhost:8000**

