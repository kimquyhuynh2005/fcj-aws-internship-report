---
title: "AWS Resources Cleanup"
date: 2026-06-06
weight: 6
chapter: false
pre: "<b>5.6. </b>"
---

## Step 6: Cleanup

{{% notice warning %}}
**Always clean up!** SageMaker Endpoints charge by the hour even when idle. A `ml.t2.medium` instance costs ~$0.056/hour. Leaving it running for a week = ~$9.40 in unexpected charges.
{{% /notice %}}

### Run Cleanup Script

```bash
python week6_deployment/cleanup.py
```

### Cleanup Script

```python
# cleanup.py
import boto3

sm_client = boto3.client('sagemaker', region_name='ap-southeast-1')

ENDPOINT_NAME = 'rossmann-forecasting-endpoint'
ENDPOINT_CONFIG_NAME = 'rossmann-endpoint-config'
MODEL_NAME = 'rossmann-xgboost-model'

def delete_resource(resource_type, name, delete_fn):
    try:
        delete_fn(name)
        print(f"✅ Deleted {resource_type}: {name}")
    except sm_client.exceptions.ResourceNotFound:
        print(f"⚠️  {resource_type} not found: {name} (already deleted)")
    except Exception as e:
        print(f"❌ Error deleting {resource_type}: {e}")

# Delete in correct order: Endpoint → Config → Model
delete_resource('Endpoint', ENDPOINT_NAME,
    lambda name: sm_client.delete_endpoint(EndpointName=name))

delete_resource('Endpoint Config', ENDPOINT_CONFIG_NAME,
    lambda name: sm_client.delete_endpoint_config(EndpointConfigName=name))

delete_resource('Model', MODEL_NAME,
    lambda name: sm_client.delete_model(ModelName=name))

print("\n🎉 Cleanup complete!")
```

### Expected Output

```
✅ Deleted Endpoint: rossmann-forecasting-endpoint
✅ Deleted Endpoint Config: rossmann-endpoint-config
✅ Deleted Model: rossmann-xgboost-model

🎉 Cleanup complete!
```

### Optional: Delete Lambda and API Gateway

```python
# cleanup_lambda.py
import boto3

# Delete Lambda
lambda_client = boto3.client('lambda', region_name='ap-southeast-1')
lambda_client.delete_function(FunctionName='rossmann-forecast-api')
print("✅ Lambda deleted")

# Delete API Gateway (get API ID from console first)
apigw = boto3.client('apigateway', region_name='ap-southeast-1')
apigw.delete_rest_api(restApiId='YOUR-API-ID')
print("✅ API Gateway deleted")
```

### Optional: Delete S3 Data

```bash
# Only if you want to remove all data
aws s3 rm s3://your-ml-forecasting-bucket/ml-forecasting/ --recursive
```

### Cost Summary for This Workshop

| Resource | Duration | Estimated Cost |
|----------|---------|---------------|
| SageMaker Endpoint (ml.t2.medium) | ~1 hour | ~$0.056 |
| S3 Storage (5 GB) | 1 month | ~$0.12 |
| Lambda invocations | Free tier | $0 |
| API Gateway | Free tier | $0 |
| **Total** | | **~$0.20** |

### Workshop Complete! 🎉

You have successfully:
- ✅ Preprocessed 1M+ rows of retail sales data
- ✅ Trained XGBoost model achieving **RMSE 925.28, MAPE 9.92%**
- ✅ Deployed model to SageMaker Endpoint
- ✅ Built serverless REST API with Lambda + API Gateway
- ✅ Validated model accuracy on real historical data (5.14% error)
- ✅ Set up CloudWatch monitoring and drift detection
- ✅ Cleaned up all resources

**Repository:** [github.com/kimquyhuynh/aws-internship-ML-forecasting](https://github.com)