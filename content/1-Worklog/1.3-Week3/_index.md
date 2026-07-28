---
title: "Tuần 3 — XGBoost Baseline + LSTM Skeleton"
date: 2026-06-20
weight: 3
chapter: false
pre: "<b>1.3. </b>"
---

## Tuần 3 — XGBoost Baseline + LSTM Skeleton ✅

**Người thực hiện:** Huỳnh Kim Quý | **Thời gian:** 20/06/2026 – 26/06/2026

---

### Công việc đã làm

1. **Train XGBoost Baseline**
   - Train local dùng XGBoost 1.7.6 với hyperparameters: `n_estimators=500, max_depth=6, learning_rate=0.05`
   - Log experiment lên SageMaker Experiments qua boto3
   - Upload model artifact lên S3

2. **Kết quả XGBoost**

| Metric | Validation | Test |
|--------|-----------|------|
| RMSE | 941.21 | **925.28** |
| MAPE | 9.92% | **9.92%** |

3. **LSTM Skeleton**
   - Tạo `model.py` — kiến trúc PyTorch LSTM
   - Tạo `dataset.py` — class TimeSeriesDataset
   - Unit test pass: forward pass, kiểm tra shape

4. **Log SageMaker Experiments bằng boto3 (workaround)**

---

### 💻 Code Snippet Nổi bật (`train_xgboost.py`)

```python
import xgboost as xgb
import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error

# 1. Khởi tạo XGBoost Regressor
model = xgb.XGBRegressor(
    n_estimators=1000,
    learning_rate=0.03,
    max_depth=10,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    tree_method='hist'
)

# 2. Huấn luyện với Early Stopping 50 vòng
model.fit(
    X_train, y_train,
    eval_set=[(X_val, y_val)],
    early_stopping_rounds=50,
    verbose=100
)

# 3. Đánh giá RMSE & MAPE trên tập Test
preds = model.predict(X_test)
test_rmse = np.sqrt(mean_squared_error(y_test, preds))
test_mape = np.mean(np.abs((y_test - preds) / y_test)) * 100

print(f"✅ XGBoost Baseline Test RMSE : {test_rmse:.2f}")
print(f"✅ XGBoost Baseline Test MAPE : {test_mape:.2f}%")
```

---

### Bài học rút ra
- XGBoost với 22 features thủ công vượt xa kỳ vọng
- SageMaker SDK 3.x bị lỗi → dùng `boto3.client()` trực tiếp (ổn định hơn)
- Luôn pin XGBoost version — lệch version giữa train và serve là lỗi thực tế đã gặp
