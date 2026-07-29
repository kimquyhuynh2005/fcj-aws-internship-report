# Hướng Dẫn Thực Hành Workshop: Pipeline Dự báo Doanh số Thương mại Điện tử trên AWS

> **Dự án:** E-commerce Sales Forecasting System on AWS SageMaker  
> **Chương trình:** AWS First Cloud AI Journey  
> **Đơn vị thực hiện:** Amazon Web Services Viet Nam Company Limited  
> **Tài liệu dùng chung:** Hướng dẫn triển khai chi tiết từng bước cho tất cả thành viên trong nhóm.

---

## 📋 MỤC LỤC
1. [Tổng quan Workshop & Kiến trúc Dự án](#1-tổng-quan-workshop--kiến-trúc-dự-án)
2. [Yêu cầu Tiền đề & Cấu hình AWS Credentials](#2-yêu-cầu-tiền-đề--cấu-hình-aws-credentials)
3. [Tiền xử lý Dữ liệu & Đưa Dữ liệu lên Amazon S3](#3-tiền-xử-lý-dữ-liệu--đưa-dữ-liệu-lên-amazon-s3)
4. [Huấn luyện & So sánh Mô hình Machine Learning](#4-huấn-luyện--so-sánh-mô-hình-machine-learning)
5. [Triển khai Serverless REST API & Live UI Dashboard](#5-triển-khai-serverless-rest-api--live-ui-dashboard)
6. [Dọn dẹp Tài nguyên AWS (Cleanup)](#6-dọn-dẹp-tài-nguyên-aws-cleanup)

---

## 1. TỔNG QUAN WORKSHOP & KIẾN TRÚC DỰ ÁN

### 1.1. Bối cảnh Dự án
**Rossmann Store Sales** là bộ dữ liệu dự báo doanh số bán lẻ nổi tiếng trên Kaggle. Bộ dữ liệu bao gồm:
- **1,017,209** bản ghi giao dịch doanh số hàng ngày.
- **1,115** cửa hàng trên toàn nước Đức.
- **942** ngày lịch sử (Tháng 1/2013 – Tháng 7/2015).
- **Đặc trưng bao gồm:** Khuyến mại, khoảng cách đối thủ cạnh tranh, loại cửa hàng, cơ cấu hàng hóa, các ngày lễ quốc gia và trường học.

### 1.2. Bài toán Kinh doanh

| Thách thức | Chưa có Dự báo | Có Dự báo Machine Learning |
|-----------|----------------|--------------------------|
| **Hàng tồn kho** | Thừa/thiếu hàng hóa cục bộ | Tối ưu hóa mức tồn kho theo từng ngày |
| **Nhân sự** | Phân công ca làm việc dư/thiếu | Đúng người, đúng thời điểm cao điểm |
| **Marketing** | Khuyến mại không đạt hiệu quả | Chọn thời điểm chiến dịch tối ưu |
| **Tài chính** | Biến động doanh thu bất ngờ | Dự báo doanh thu chủ động |

### 1.3. Sơ đồ Kiến trúc Hệ thống (4 Tầng)

```
┌─────────────────────────────────────────────────────────┐
│                    TẦNG DỮ LIỆU                         │
│  Rossmann CSV → Amazon S3 (thô + đã xử lý)              │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    TẦNG MACHINE LEARNING                │
│  Tiền xử lý & Đặc trưng → Train XGBoost Baseline        │
│  22 đặc trưng: rolling_mean, lag, promo, date...        │
│  Kết quả: RMSE 925.28, MAPE 9.92%                       │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    TẦNG PHỤC VỤ (SERVING)               │
│  SageMaker Endpoint (ml.t2.medium)                      │
│  → AWS Lambda → API Gateway REST API                    │
│  → Endpoint công khai: /forecast POST                   │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    TẦNG GIÁM SÁT                        │
│  Kiểm tra trôi dữ liệu (Z-Score Drift Detection)        │
│  CloudWatch Dashboard: RossmannForecastingDashboard     │
└─────────────────────────────────────────────────────────┘
```

### 1.4. Kết quả Thực tế Đạt được
- **Mô hình cốt lõi:** XGBoost Regressor (v1.7.6).
- **Test RMSE:** 925.28
- **Test MAPE:** 9.92%
- **Độ chính xác API:** Sai lệch 4.58% – 5.14% trên dữ liệu kiểm thử thực tế.
- **Độ trễ phản hồi (API Latency):** ~1.1 giây.
- **Chi phí máy chủ Endpoint:** ~$0.05/giờ (`ml.t2.medium`).

---

## 2. YÊU CẦU TIỀN ĐỀ & CẤU HÌNH AWS CREDENTIALS

### 2.1. Yêu cầu Tài khoản AWS
> ⚠️ **Lưu ý quan trọng:** Hãy kiểm tra **Service Quotas** của Amazon SageMaker trên AWS Console trước khi bắt đầu. Đảm bảo quota cho `SageMaker Endpoints` (instance `ml.t2.medium`) ≥ 1.

#### Chính sách Phân quyền IAM (JSON Policy)
Khởi tạo một IAM Role / User có các quyền truy cập tối thiểu sau:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
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
      "Action": [
        "lambda:*",
        "apigateway:*",
        "cloudwatch:*",
        "logs:*"
      ],
      "Resource": "*"
    }
  ]
}
```

### 2.2. Khởi tạo Môi trường Local (Python Virtual Environment)

```powershell
# 1. Clone dự án về máy cục bộ
git clone https://github.com/YOUR-USERNAME/aws-internship-ML-forecasting.git
cd aws-internship-ML-forecasting

# 2. Khởi tạo và kích hoạt môi trường ảo Python
python -m venv venv
.\venv\Scripts\activate    # Trên Windows PowerShell

# 3. Cài đặt toàn bộ các thư viện phụ thuộc
pip install -r requirements.txt

# 4. Kiểm tra cấu hình kết nối AWS
python verify_setup.py
```

### 2.3. Cấu hình Tập tin `config.py`

Tạo/chỉnh sửa file `config.py` ở thư mục gốc dự án:

```python
# config.py — Cấu hình thông tin tài khoản và tài nguyên AWS
BUCKET_NAME = "aws-internship-hkq-2026"
REGION = "ap-southeast-1"
PREFIX = "ml-forecasting"

S3_RAW_DATA = f"s3://{BUCKET_NAME}/{PREFIX}/data/raw/"
S3_PROCESSED_DATA = f"s3://{BUCKET_NAME}/{PREFIX}/data/processed/"
S3_MODEL_ARTIFACTS = f"s3://{BUCKET_NAME}/{PREFIX}/models/artifacts/"
SAGEMAKER_ROLE_ARN = "arn:aws:iam::119505195050:role/SageMaker-ExecutionRole-hkq"
```

---

## 3. TIỀN XỬ LÝ DỮ LIỆU & ĐƯA DỮ LIỆU LÊN AMAZON S3

### 3.1. Cấu trúc Tập tin Dữ liệu
```
data/raw/
├── train.csv    — 1,017,209 dòng × 9 cột (lịch sử giao dịch)
└── store.csv    — 1,115 dòng × 10 cột (thông tin cửa hàng)
```

### 3.2. Thực thi Kịch bản Tiền xử lý
```bash
python week2_preprocessing/preprocessing.py
```

### 3.3. Quy trình 4 Bước Tiền xử lý & Tạo Đặc trưng:
1. **Gộp dữ liệu (Data Merging):** Kết hợp metadata từ `store.csv` vào `train.csv` theo khóa chính `Store`.
2. **Lọc dữ liệu rác (Data Cleaning):** Loại bỏ 172,817 bản ghi khi cửa hàng đóng cửa (`Open = 0`) hoặc doanh số bằng 0.
3. **Tạo 22 Đặc trưng Kỹ thuật (Feature Engineering):**
   - **Đặc trưng Lịch (Calendar Features):** `Year`, `Month`, `Day`, `DayOfWeek`, `WeekOfYear`, `IsWeekend`, `IsDecember`.
   - **Trung bình Trượt (Rolling Means):** `rolling_mean_7`, `rolling_mean_14`, `rolling_mean_30`.
   - **Độ trễ Thời gian (Lag Features):** `sales_lag_7`, `sales_lag_14`, `sales_lag_30`.
4. **Phân chia Dữ liệu theo Thời gian (Chronological Split):**
   - **Tập Train:** Dữ liệu trước `2015-06-01` (785,727 bản ghi).
   - **Tập Validation:** Tháng 06/2015 (28,423 bản ghi).
   - **Tập Test:** Tháng 07/2015 (30,188 bản ghi).

---

## 4. HUẤN LUYỆN & SO SÁNH MÔ HÌNH MACHINE LEARNING

### 4.1. Kết quả So sánh 2 Mô hình

| Mô hình | Test RMSE | Test MAPE | Thời gian Train | Quyết định |
|---------|----------|----------|-----------------|-----------|
| **XGBoost Regressor (v1.7.6)** | **925.28** | **9.92%** | **~45 giây** | ✅ Chọn làm Production Model |
| PyTorch LSTM (2-layer) | 3,044.43 | 32.79% | ~8 phút | ❌ Mô hình thử nghiệm |

> **Nhận xét:** Với dữ liệu chuỗi thời gian dạng bảng (Tabular Data), XGBoost đạt hiệu năng áp đảo so với PyTorch LSTM cả về độ chính xác lẫn tốc độ tính toán khi kết hợp với các đặc trưng Rolling & Lag.

### 4.2. Thực thi Huấn luyện XGBoost
```bash
python week3_xgboost/train_xgboost.py
```

### 4.3. Phân tích Mức độ Quan trọng Đặc trưng (SHAP Values)
```bash
python week5_registry/shap_analysis.py
```

**Bảng xếp hạng Top 5 Đặc trưng ảnh hưởng lớn nhất tới Doanh số:**

| Thứ tự | Đặc trưng | Mức độ ảnh hưởng | Mô tả |
|--------|-----------|------------------|-------|
| 1 | `rolling_mean_14` | Rất cao | Trung bình doanh số 14 ngày gần nhất |
| 2 | `Promo` | Rất cao | Chương trình khuyến mại (tăng ~37% doanh số) |
| 3 | `rolling_mean_30` | Cao | Xu hướng doanh số 30 ngày |
| 4 | `DayOfWeek` | Trung bình | Chu kỳ tiêu dùng trong tuần |
| 5 | `sales_lag_7` | Trung bình | Doanh số cùng ngày tuần trước |

---

## 5. TRIỂN KHAI SERVERLESS REST API & LIVE UI DASHBOARD

### 5.1. Khởi tạo SageMaker Endpoint
```bash
python week6_deployment/deploy_endpoint.py
```

### 5.2. Triển khai AWS Lambda Wrapper
```bash
python week6_deployment/deploy_lambda.py
```

### 5.3. Kiểm thử API Thời gian thực (Inference Verification)
```bash
python week6_deployment/build_real_features.py
```

**Kết quả kiểm thử đầu ra thực tế:**
```text
Store: 1 | Ngày dự báo: 2015-06-15
Doanh số THỰC TẾ: 5,518.00
Doanh số DỰ BÁO:   5,770.64
Mức sai lệch:      4.58%
✅ PASS — Mức sai lệch 4.58% nằm trong ngưỡng kiểm định chất lượng (< 15%)
```

### 5.4. Khởi chạy Giao diện Trực quan Live Dashboard (UI Demo)
Dự án cung cấp giao diện Web Dashboard thời gian thực (Dark Mode / Glassmorphism) hỗ trợ mô phỏng kịch bản **What-If** và biểu đồ xu hướng doanh số 14 ngày.

```powershell
# Chạy Server Backend & UI tại cổng 8000
python demo_ui/server.py
```
👉 Truy cập trình duyệt tại địa chỉ: **`http://localhost:8000`**

---

## 6. DỌN DẸP TÀI NGUYÊN AWS (CLEANUP)

> ⚠️ **CẢNH BÁO CHI PHÍ:** SageMaker Endpoint (`ml.t2.medium`) tính phí liên tục theo giờ kể cả khi không gửi request. Ngay sau khi hoàn tất kiểm thử hoặc demo, bạn **bắt buộc phải chạy script dọn dẹp**.

### Thực thi Kịch bản Dọn dẹp Tự động:
```bash
python week6_deployment/cleanup.py
```

### Danh mục Tài nguyên sẽ được giải phóng:
1. **SageMaker Endpoint:** `rossmann-forecasting-endpoint`
2. **Endpoint Configuration:** `rossmann-config-*`
3. **SageMaker Model:** `rossmann-xgboost-*`
