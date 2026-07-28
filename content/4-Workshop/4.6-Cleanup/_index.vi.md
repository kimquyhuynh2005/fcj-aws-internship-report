---
title: "6. Dọn dẹp tài nguyên"
date: 2026-06-06
weight: 6
chapter: false
pre: "<b>4.6. </b>"
---

## Bước 6: Dọn dẹp Tài nguyên AWS (Cleanup)

{{% notice warning %}}
**Lưu ý quan trọng:** Luôn dọn dẹp tài nguyên sau khi kết thúc thử nghiệm! SageMaker Endpoint tính phí theo giờ ngay cả khi không có lưu lượng truy cập. Một instance `ml.t2.medium` tốn khoảng ~$0.056/giờ. Nếu quên tắt trong 1 tuần = ~$9.40 chi phí không đáng có.
{{% /notice %}}

---

### Khởi chạy Script Dọn dẹp Tự động

```bash
python week6_deployment/cleanup.py
```

---

### Mã nguồn Script Dọn dẹp (`cleanup.py`)

```python
import boto3

sm_client = boto3.client('sagemaker', region_name='ap-southeast-1')

ENDPOINT_NAME = 'rossmann-forecasting-endpoint'
ENDPOINT_CONFIG_NAME = 'rossmann-endpoint-config'
MODEL_NAME = 'rossmann-xgboost-model'

def delete_resource(resource_type, name, delete_fn):
    try:
        delete_fn(name)
        print(f"✅ Đã xóa {resource_type}: {name}")
    except sm_client.exceptions.ResourceNotFound:
        print(f"⚠️  Không tìm thấy {resource_type}: {name} (đã được xóa trước đó)")
    except Exception as e:
        print(f"❌ Lỗi khi xóa {resource_type}: {e}")

# Xóa theo đúng thứ tự phụ thuộc: Endpoint → Config → Model
delete_resource('Endpoint', ENDPOINT_NAME,
    lambda name: sm_client.delete_endpoint(EndpointName=name))

delete_resource('Endpoint Config', ENDPOINT_CONFIG_NAME,
    lambda name: sm_client.delete_endpoint_config(EndpointConfigName=name))

delete_resource('Model', MODEL_NAME,
    lambda name: sm_client.delete_model(ModelName=name))

print("\n🎉 Đã dọn dẹp tài nguyên SageMaker thành công!")
```

---

### Kết quả Thực thi Mong đợi

```text
✅ Đã xóa Endpoint: rossmann-forecasting-endpoint
✅ Đã xóa Endpoint Config: rossmann-endpoint-config
✅ Đã xóa Model: rossmann-xgboost-model

🎉 Đã dọn dẹp tài nguyên SageMaker thành công!
```

---

### Dọn dẹp Lambda & API Gateway (Tùy chọn)

```python
import boto3

# 1. Xóa Lambda Function
lambda_client = boto3.client('lambda', region_name='ap-southeast-1')
lambda_client.delete_function(FunctionName='rossmann-forecast-api')
print("✅ Đã xóa Lambda function")

# 2. Xóa API Gateway
apigw = boto3.client('apigateway', region_name='ap-southeast-1')
apigw.delete_rest_api(restApiId='YOUR-API-ID')
print("✅ Đã xóa API Gateway")
```

---

### Bảng Tổng hợp Chi phí Thực tế Dự án

| Tài nguyên | Thời gian duy trì | Chi phí ước tính |
|---|---|---|
| SageMaker Endpoint (ml.t2.medium) | ~1.5 giờ | ~$0.08 |
| S3 Bucket Storage (~1.5 GB) | 1 tháng | ~$0.04 |
| AWS Lambda Invocations | Free Tier | $0.00 |
| Amazon API Gateway Requests | Free Tier | $0.00 |
| **TỔNG CỘNG CHI PHÍ** | | **~$0.12** |

---

### Hoàn thành Workshop! 🎉
