---
title: "4. Huấn luyện Mô hình (Model Training)"
date: 2026-06-06
weight: 4
chapter: false
pre: "<b>4.4. </b>"
---

## Bước 4: Huấn luyện Mô hình ML

### Lý do chọn mô hình XGBoost?

Nhóm đã huấn luyện và so sánh 2 kiến trúc mô hình:

| Mô hình | Test RMSE | Test MAPE | Quyết định |
|---------|----------|----------|-----------|
| **XGBoost 1.7.6** | **925.28** | **9.92%** | ✅ Chọn làm Production |
| PyTorch LSTM | 3,044.43 | 32.79% | ❌ Thử nghiệm |

> **Kết luận:** Với dữ liệu chuỗi thời gian dạng bảng (785K bản ghi), XGBoost vượt trội hơn so với LSTM — đặc biệt khi các đặc trưng lag và rolling được xây dựng đầy đủ.

### Chạy Huấn luyện XGBoost

```bash
python week3_xgboost/train_xgboost.py
```

### Đánh giá Độ quan trọng Đặc trưng với SHAP

```bash
python week5_registry/shap_analysis.py
```

**Top 5 đặc trưng quan trọng nhất theo SHAP:**

| Thứ tự | Đặc trưng | Mức độ ảnh hưởng |
|--------|-----------|------------------|
| 1 | `rolling_mean_14` | Rất cao |
| 2 | `Promo` | Rất cao |
| 3 | `rolling_mean_30` | Cao |
| 4 | `DayOfWeek` | Trung bình |
| 5 | `lag_7` | Trung bình |
