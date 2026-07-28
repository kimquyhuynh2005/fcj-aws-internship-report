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

### Bài học rút ra
- Với tabular time series <1M dòng, XGBoost/LightGBM thường thắng LSTM
- LSTM cần chuẩn hoá đầu vào kỹ và sequence dài hơn để nắm bắt seasonality
- So sánh models rõ ràng tăng tính thuyết phục cho lựa chọn cuối
