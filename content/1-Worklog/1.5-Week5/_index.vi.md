---
title: "Tuần 5 — Model Registry + SHAP Analysis"
date: 2026-07-04
weight: 5
chapter: false
pre: "<b>1.5. </b>"
---

## Tuần 5 — Model Registry + SHAP Analysis ✅

**Người thực hiện:** Huỳnh Kim Quý | **Thời gian:** 04/07/2026 – 10/07/2026

---

### Công việc đã làm

1. **Model Registry (workaround S3/JSON)**
   - SageMaker Model Registry quota = 0 → lưu metadata dạng JSON trên S3
   - Đăng ký cả hai model với version, metrics, và trạng thái phê duyệt

   | Model | RMSE | MAPE | Trạng thái |
   |-------|------|------|-----------|
   | XGBoost-Baseline | 925.28 | 9.92% | Approved ✅ |
   | LSTM-Forecaster | 3,044.43 | 32.79% | Approved ✅ |

2. **Phân tích SHAP Feature Importance**
   - Dùng `shap.TreeExplainer` trên XGBoost model
   - Tạo `shap_importance.png` và `shap_summary.png`
   - Upload plots lên S3

3. **Top Features theo SHAP**

   | Hạng | Feature | Tầm quan trọng |
   |------|---------|--------------|
   | 1 | rolling_mean_14 | ⭐⭐⭐⭐⭐ |
   | 2 | Promo | ⭐⭐⭐⭐⭐ |
   | 3 | rolling_mean_30 | ⭐⭐⭐⭐ |
   | 4 | DayOfWeek | ⭐⭐⭐ |
   | 5 | lag_7 | ⭐⭐⭐ |

4. **Viết `inference.py` (phiên bản Production)**
   - Input: dict raw features
   - Process: kiểm tra features → predict → trả về giá trị doanh số
   - Không có `np.expm1()` — model train trực tiếp trên Sales gốc

---

### 💻 Code Snippet Nổi bật

#### 1. Quản lý Model Registry dạng JSON trên S3 (`model_registry.py`)
```python
import json
import boto3

s3_client = boto3.client('s3', region_name='ap-southeast-1')
BUCKET = 'aws-internship-hkq-2026'

metadata = {
    "ModelName": "rossmann-xgboost-model",
    "ModelVersion": "v1.0",
    "Framework": "XGBoost 1.7-1",
    "TestMetrics": {"RMSE": 925.28, "MAPE": 9.92},
    "ApprovalStatus": "Approved",
    "ArtifactLocation": f"s3://{BUCKET}/ml-forecasting/models/artifacts/xgboost_model.tar.gz"
}

s3_client.put_object(
    Bucket=BUCKET,
    Key='ml-forecasting/models/registry/v1.0_metadata.json',
    Body=json.dumps(metadata, indent=2)
)
print("✅ Registered XGBoost Model Metadata to S3 Registry!")
```

#### 2. Phân tích Tầm quan trọng Đặc trưng (`shap_analysis.py`)
```python
import shap
import pickle

with open('models/xgboost_model.pkl', 'rb') as f:
    model = pickle.load(f)

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test.sample(1000, random_state=42))

# Top 3 đặc trưng ảnh hưởng lớn nhất: rolling_mean_14, Promo, rolling_mean_30
shap.summary_plot(shap_values, X_test, show=False)
```

---

### Bài học rút ra
- SHAP values xác nhận trực giác kinh doanh: khuyến mãi và lịch sử doanh số gần đây là features dự báo tốt nhất
- Luôn viết `inference.py` riêng biệt với code training — file này sẽ vào SageMaker container
- Lưu metadata model dưới dạng JSON trên S3 khi không có registry quota — workaround thực tế
