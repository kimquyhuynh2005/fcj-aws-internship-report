---
title: "Tuần 5 — Model Registry & SHAP Analysis"
date: 2026-07-04
weight: 5
chapter: false
pre: "<b>1.5. </b>"
---

# Tuần 5 — Quản lý Mô hình Model Registry & Giải thích Mô hình với SHAP Analysis

**Người thực hiện:** Huỳnh Kim Quý (Data & Machine Learning Engineer)  
**Thời gian:** 04/07/2026 – 10/07/2026  
**Mục tiêu chính:** Xây dựng cơ chế Model Registry quản lý phiên bản mô hình trên AWS S3, triển khai phân tích độ quan trọng đặc trưng bằng thuật toán SHAP TreeExplainer, và viết kịch bản `inference.py` chuẩn bị cho môi trường Serving.

---

## 1. Chi tiết Công việc Thực hiện

### 1.1. Xây dựng S3 Model Registry Workaround
Do tài khoản AWS thử nghiệm gặp giới hạn SageMaker Model Registry Quota = 0, nhóm đã chủ động thiết kế một **Kiến trúc S3 Metadata Registry** thay thế linh hoạt:
- Mỗi khi mô hình hoàn tất quá trình huấn luyện, tập tin Artifact (`xgboost_model.tar.gz`) được đẩy lên thư mục `s3://aws-internship-hkq-2026/ml-forecasting/models/artifacts/`.
- Một tập tin cấu hình JSON chứa đầy đủ thông số phiên bản (`v1.0`), danh mục siêu tham số, chỉ số đánh giá Test RMSE/MAPE và trạng thái duyệt (`Approved`) được tự động khởi tạo và lưu vết tại `s3://aws-internship-hkq-2026/ml-forecasting/models/registry/v1.0_metadata.json`.

| Mô hình đăng ký | Phiên bản | Chỉ số RMSE | Chỉ số MAPE | Trạng thái Duyệt | Vị trí Artifact trên S3 |
|-----------------|-----------|-------------|-------------|-------------------|------------------------|
| **XGBoost-Baseline** ⭐ | `v1.0` | **925.28** | **9.92%** | **Approved ✅** | `s3://.../xgboost_model.tar.gz` |
| PyTorch-LSTM | `v0.1-exp` | 3,044.43 | 32.79% | Rejected ❌ | `s3://.../lstm_model.tar.gz` |

### 1.2. Phân tích Độ quan trọng Đặc trưng với SHAP TreeExplainer (`shap_analysis.py`)
Để mở hộp đen (Black-box) của thuật toán XGBoost và giải thích lý do mô hình đưa ra kết quả dự báo doanh số cho từng cửa hàng, nhóm đã triển khai thư viện **SHAP (SHapley Additive exPlanations)** dựa trên phương pháp `shap.TreeExplainer`:

| Hạng | Tên Đặc trưng (Feature) | Ý nghĩa Nghiệp vụ | Tầm ảnh hưởng SHAP Value |
|------|-------------------------|-------------------|--------------------------|
| 1 | `rolling_mean_14` | Trung bình doanh số 14 ngày gần nhất | ⭐⭐⭐⭐⭐ (Ảnh hưởng lớn nhất đến xu hướng) |
| 2 | `Promo` | Chương trình khuyến mại đang chạy | ⭐⭐⭐⭐⭐ (Đột biến doanh số tức thì) |
| 3 | `rolling_mean_30` | Trung bình doanh số 30 ngày (tháng) | ⭐⭐⭐⭐ (Độ ổn định doanh số chu kỳ) |
| 4 | `DayOfWeek` | Ngày trong tuần (Thứ 2 - Chủ Nhật) | ⭐⭐⭐ (Tính chu kỳ tiêu dùng cuối tuần) |
| 5 | `sales_lag_7` | Doanh số của đúng ngày này tuần trước | ⭐⭐⭐ (Tương quan cùng thứ tuần trước) |

> **Phân tích nghiệp vụ:** Kết quả SHAP khẳng định hoàn toàn trực giác kinh doanh: **Chương trình khuyến mại (`Promo`)** và **Xu hướng doanh số 2 tuần gần nhất (`rolling_mean_14`)** là hai yếu tố quyết định hàng đầu tác động đến doanh số bán lẻ của Rossmann.

---

## 2. Mã nguồn Kỹ thuật Nổi bật

### 2.1. Đăng ký Model Metadata lên S3 Registry (`model_registry.py`)
```python
import json
import boto3

s3_client = boto3.client('s3', region_name='ap-southeast-1')
BUCKET = 'aws-internship-hkq-2026'

# Khởi tạo bản ghi Metadata chuẩn hóa dạng JSON
metadata = {
    "ModelName": "rossmann-xgboost-model",
    "ModelVersion": "v1.0",
    "Framework": "XGBoost 1.7.6",
    "TestMetrics": {
        "RMSE": 925.28,
        "MAPE": 9.92
    },
    "ApprovalStatus": "Approved",
    "ArtifactLocation": f"s3://{BUCKET}/ml-forecasting/models/artifacts/xgboost_model.tar.gz",
    "CreatedBy": "Huynh Kim Quy",
    "Timestamp": "2026-07-08T10:30:00Z"
}

# Đẩy lên S3 Registry Folder
s3_client.put_object(
    Bucket=BUCKET,
    Key='ml-forecasting/models/registry/v1.0_metadata.json',
    Body=json.dumps(metadata, indent=2)
)
print("✅ Successfully Registered Model Metadata to S3 Registry!")
```

### 2.2. Kịch bản Phục vụ Dự báo Production (`inference.py`)
```python
import os
import json
import pickle
import numpy as np

def model_fn(model_dir):
    """Hàm tải mô hình từ SageMaker Serving Container."""
    model_path = os.path.join(model_dir, "xgboost_model.pkl")
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    return model

def predict_fn(input_data, model):
    """Hàm thực thi dự báo khi nhận JSON payload từ AWS Lambda."""
    # input_data là mảng 22 đặc trưng dạng numpy array
    predictions = model.predict(input_data)
    # Trả về kết quả dự báo doanh số thực tế (đảm bảo không bị âm)
    return np.maximum(0, predictions).tolist()
```

---

## 3. Bài học Kỹ thuật Tích lũy

1. **Linh hoạt trong Kiến trúc Cloud:** Khi dịch vụ quản lý chính thức (SageMaker Model Registry) bị vướng rào cản quota, việc thiết kế phương án thay thế nhẹ nhàng bằng S3 JSON Metadata vẫn đảm bảo đầy đủ tính năng theo dõi phiên bản sản xuất.
2. **Tính Minh bạch của Mô hình (Model Explainability):** Phân tích SHAP không chỉ giúp kiểm chứng tính đúng đắn của dữ liệu mà còn gia tăng độ tin cậy của doanh nghiệp đối với hệ thống dự báo AI.
3. **Tách biệt Mã nguồn Training và Inference:** Viết kịch bản `inference.py` độc lập ngay từ Tuần 5 giúp việc đóng gói container SageMaker Endpoint ở các tuần sau diễn ra vô cùng thuận lợi.
