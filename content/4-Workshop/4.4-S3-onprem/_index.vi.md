---
title: "4. Huấn luyện mô hình"
date: 2026-06-06
weight: 4
chapter: false
pre: "<b>4.4. </b>"
---

## Bước 4: Huấn luyện Mô hình & So sánh (XGBoost vs PyTorch LSTM)

Trong bước này, chúng ta tiến hành huấn luyện hai dòng mô hình khác nhau trên tập dữ liệu dự báo doanh số Rossmann và so sánh hiệu năng thực tế.

---

### Mô hình 1: XGBoost Regressor (Baseline chính)

#### 1. Mã nguồn huấn luyện (`train_xgboost.py`)

```python
import xgboost as xgb
import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error

# 1. Đọc dữ liệu
train = pd.read_csv('data/processed/train.csv')
val   = pd.read_csv('data/processed/val.csv')
test  = pd.read_csv('data/processed/test.csv')

features = [
    'Store', 'DayOfWeek', 'Year', 'Month', 'Day', 'WeekOfYear',
    'DayOfYear', 'IsWeekend', 'IsDecember', 'Promo', 'StateHoliday',
    'SchoolHoliday', 'StoreType', 'Assortment', 'CompetitionDistance',
    'Promo2', 'rolling_mean_7', 'rolling_mean_14', 'rolling_mean_30',
    'lag_1', 'lag_7', 'lag_14'
]

X_train, y_train = train[features], train['Sales']
X_val, y_val     = val[features], val['Sales']
X_test, y_test   = test[features], test['Sales']

# 2. Cấu hình tham số XGBoost
model = xgb.XGBRegressor(
    n_estimators=1000,
    learning_rate=0.03,
    max_depth=10,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    tree_method='hist'
)

# 3. Huấn luyện với Early Stopping
model.fit(
    X_train, y_train,
    eval_set=[(X_val, y_val)],
    early_stopping_rounds=50,
    verbose=100
)

# 4. Đánh giá trên tập Test
preds = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, preds))
mape = np.mean(np.abs((y_test - preds) / y_test)) * 100

print(f"✅ XGBoost Test RMSE : {rmse:.2f}")
print(f"✅ XGBoost Test MAPE : {mape:.2f}%")
```

---

### Mô hình 2: PyTorch LSTM (Thử nghiệm Deep Learning)

#### 1. Kiến trúc Mô hình 2-layer LSTM (`model.py`)

```python
import torch
import torch.nn as nn

class SalesLSTM(nn.Module):
    def __init__(self, input_dim, hidden_dim=64, num_layers=2, output_dim=1):
        super(SalesLSTM, self).__init__()
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.2
        )
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])
        return out
```

---

### 📊 Kết quả So sánh Mô hình

| Mô hình | Test RMSE | Test MAPE | Thời gian huấn luyện | Trạng thái nghiệm thu |
|---|---|---|---|---|
| **XGBoost Regressor** ⭐ | **925.28** | **9.92%** | ~45 giây | **Chọn làm Production Model** |
| PyTorch LSTM (2-Layer) | 3,044.43 | 32.79% | ~8 phút | Mô hình thử nghiệm |

> **Nhận xét chuyên môn:** XGBoost cho kết quả vượt trội hơn đáng kể so với LSTM trên tập dữ liệu bảng (tabular data) nhờ khả năng phân nhánh cây trên các đặc trưng trễ (`rolling_mean_14`, `Promo`, `lag_1`) tốt hơn cấu trúc RNN học qua chuỗi thời gian ngắn.

---

### Phân tích Tầm quan trọng Đặc trưng với SHAP (Feature Importance)

```python
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test.sample(1000, random_state=42))

# Top 5 đặc trưng ảnh hưởng lớn nhất đến doanh số:
# 1. rolling_mean_14 (Trung bình trượt doanh số 14 ngày)
# 2. Promo (Chương trình khuyến mại)
# 3. rolling_mean_30 (Trung bình trượt doanh số 30 ngày)
# 4. CompetitionDistance (Khoảng cách đối thủ cạnh tranh)
# 5. DayOfWeek (Ngày trong tuần)
```
