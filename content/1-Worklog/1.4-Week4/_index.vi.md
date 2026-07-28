---
title: "Tuần 4 — Train PyTorch LSTM"
date: 2026-06-27
weight: 4
chapter: false
pre: "<b>1.4. </b>"
---

## Tuần 4 — Train PyTorch LSTM ✅

**Người thực hiện:** Huỳnh Kim Quý | **Thời gian:** 27/06/2026 – 03/07/2026

---

### Công việc đã làm

1. **Train PyTorch LSTM**
   - Kiến trúc: 2-layer LSTM, hidden_size=128, dropout=0.2
   - Train trên CPU 50 epochs (chưa đủ để hội tụ)
   - Lưu model tốt nhất vào `week4_lstm/models/lstm_best.pt`
   - Upload lên S3

2. **So sánh models**

| Model | Test RMSE | Test MAPE | Quyết định |
|-------|----------|----------|-----------|
| **XGBoost** ⭐ | **925.28** | **9.92%** | ✅ Production |
| LSTM | 3,044.43 | 32.79% | ❌ Chỉ là experiment |

3. **Phân tích nguyên nhân LSTM kém**
   - Features không được chuẩn hoá → LSTM nhạy với scale đầu vào
   - Sequence length = 7 quá ngắn để nắm bắt seasonal patterns
   - Thiếu lag features (so với 22 features của XGBoost)
   - Train trên CPU — thiếu epochs để hội tụ

4. **Quyết định**
   > **XGBoost được chọn làm production model.** LSTM kém hơn được ghi nhận là bài học, không phải thất bại — time series dạng bảng với dataset vừa thường ưu tiên gradient boosting hơn deep learning.

---

### 💻 Code Snippet Nổi bật (`lstm_model.py`)

```python
import torch
import torch.nn as nn

class SalesLSTM(nn.Module):
    """Kiến trúc PyTorch 2-layer LSTM cho bài toán dự báo chuỗi thời gian."""
    def __init__(self, input_dim, hidden_dim=128, num_layers=2, output_dim=1):
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
        # Lấy hidden state của timesteps cuối cùng
        out = self.fc(out[:, -1, :])
        return out
```

---

### Bài học rút ra
- Với tabular time series <1M dòng, XGBoost/LightGBM thường thắng LSTM
- LSTM cần chuẩn hoá đầu vào kỹ và sequence dài hơn để nắm bắt seasonality
- So sánh models rõ ràng tăng tính thuyết phục cho lựa chọn cuối
