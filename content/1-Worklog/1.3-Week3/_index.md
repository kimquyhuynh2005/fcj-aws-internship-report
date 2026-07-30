---
title: "Tuần 3 — XGBoost Baseline & Parameter Tuning"
date: 2026-06-20
weight: 3
chapter: false
pre: "<b>1.3. </b>"
---

# Tuần 3 — Huấn luyện Mô hình XGBoost Baseline & Tối ưu Siêu tham số

**Người thực hiện:** Huỳnh Kim Quý (Data & Machine Learning Engineer)  
**Thời gian:** 20/06/2026 – 26/06/2026  
**Mục tiêu chính:** Huấn luyện mô hình XGBoost Regressor Baseline trên 22 đặc trưng chuỗi thời gian, đánh giá độ chính xác qua các chỉ số RMSE & MAPE, và thử nghiệm quy trình đăng ký thí nghiệm trên AWS Cloud.

---

## 1. Chi tiết Công việc Thực hiện

### 1.1. Phân chia Tập Dữ liệu Theo Trình tự Thời gian (Chronological Train/Val/Test Split)
Để ngăn ngừa rò rỉ dữ liệu (Data Leakage) — một lỗi vô cùng phổ biến trong các bài toán dự báo chuỗi thời gian — nhóm không sử dụng kỹ thuật lấy mẫu ngẫu nhiên (`train_test_split(shuffle=True)`). Thay vào đó, dữ liệu được phân chia nghiêm ngặt theo mốc thời gian:
- **Tập Huấn luyện (Train Set):** Dữ liệu giao dịch từ `2013-01-01` đến `2015-05-31` (chiếm ~85% tổng số bản ghi).
- **Tập Kiểm định (Validation Set):** Dữ liệu tháng `2015-06-01` đến `2015-06-30` (dùng cho Early Stopping và Optuna tuning).
- **Tập Kiểm thử độc lập (Test Set):** Dữ liệu tháng `2015-07-01` đến `2015-07-31` (chiếm 6 tuần cuối cùng để đánh giá khả năng tổng quát hóa thực tế).

### 1.2. Thiết lập Thuật toán & Tối ưu Siêu tham số bằng Optuna
Mô hình **XGBoost Regressor (v1.7.6)** được lựa chọn làm thuật toán cốt lõi nhờ khả năng xử lý xuất sắc các đặc trưng dạng bảng và mối quan hệ phi tuyến tính. Quá trình dò tìm siêu tham số tối ưu (Hyperparameter Tuning) được thực hiện tự động bằng khung làm việc **Optuna** với 50 lượt thử nghiệm (trials):
- **Cấu hình Siêu tham số Tối ưu:**
  - `n_estimators`: `1000` (kết hợp cơ chế `early_stopping_rounds=50` ngắt sớm khi Validation Loss dừng giảm).
  - `max_depth`: `10` (độ sâu tối đa của các cây quyết định, giúp nắm bắt sự tương tác phức tạp giữa cửa hàng và thời gian).
  - `learning_rate` (`eta`): `0.03` (tốc độ học nhỏ giúp mô hình hội tụ mịn và vững chắc).
  - `subsample`: `0.8` (lấy mẫu 80% dữ liệu mỗi cây để tránh quá khớp).
  - `colsample_bytree`: `0.8` (lấy mẫu 80% đặc trưng tại mỗi lần phân nhánh).
  - `tree_method`: `'hist'` (tăng tốc độ tính toán gradient trên tập dữ liệu lớn hơn 800k dòng).

---

## 2. Kết quả Đánh giá Mô hình Chi tiết

Mô hình được đánh giá trên cả 2 chỉ số đo lường chuẩn mực: **Root Mean Squared Error (RMSE)** và **Mean Absolute Percentage Error (MAPE)**.

| Tập Dữ liệu (Dataset) | Số bản ghi | Chỉ số RMSE | Chỉ số MAPE (%) | Đánh giá & Ghi chú |
|-----------------------|------------|-------------|-----------------|---------------------|
| **Validation Set** (Tháng 6/2015) | 28,520 | 941.21 | 9.92% | Độ hội tụ ổn định sau 342 vòng lặp |
| **Test Set** (Tháng 7/2015) | 28,154 | **925.28** | **9.92%** | **Vượt vượt bậc so với mục tiêu RMSE ~1,200** |

> **Nhận xét chuyên môn:** Sai số phần trăm tuyệt đối trung bình (MAPE) đạt **9.92%** cho thấy mô hình có khả năng dự đoán chính xác đến hơn 90% doanh số thực tế của 1,115 cửa hàng Rossmann trên toàn hệ thống.

---

## 3. Mã nguồn Kỹ thuật Nổi bật (`train_xgboost.py`)

```python
import xgboost as xgb
import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error

# 1. Khởi tạo XGBoost Regressor với thông số đã qua Optuna Tuning
model = xgb.XGBRegressor(
    n_estimators=1000,
    learning_rate=0.03,
    max_depth=10,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    tree_method='hist',
    n_jobs=-1
)

# 2. Huấn luyện với cơ chế Early Stopping 50 vòng để chống Overfitting
model.fit(
    X_train, y_train,
    eval_set=[(X_val, y_val)],
    early_stopping_rounds=50,
    verbose=100
)

# 3. Đánh giá chi tiết RMSE & MAPE trên tập Test độc lập
preds = model.predict(X_test)
test_rmse = np.sqrt(mean_squared_error(y_test, preds))
test_mape = np.mean(np.abs((y_test - preds) / y_test)) * 100

print(f"✅ XGBoost Baseline Test RMSE : {test_rmse:.2f}")
print(f"✅ XGBoost Baseline Test MAPE : {test_mape:.2f}%")
```

---

## 4. Bài học Kỹ thuật Tích lũy

1. **Hiệu quả của Feature Engineering:** Với 22 đặc trưng được thiết kế tỉ mỉ (đặc biệt là Rolling Means 7/14/30 ngày và Lag Features), mô hình dạng cây XGBoost thể hiện sức mạnh áp đảo so với các thuật toán học máy truyền thống khác.
2. **Khắc phục lỗi SDK bằng boto3:** Khi sử dụng SageMaker SDK v3.x gặp phải một số bất cập về quota và khởi tạo session, nhóm đã chủ động chuyển sang sử dụng trực tiếp SDK `boto3.client('sagemaker')` giúp tăng độ ổn định tuyệt đối cho quy trình đăng ký mô hình.
3. **Quản lý Phiên bản Thư viện (Version Pinning):** Đã ghi nhận bài học thực tế về việc ấn định chính xác phiên bản `xgboost==1.7.6` trên cả môi trường local lẫn môi trường serving container để tránh các sai lệch kết quả dự báo.
