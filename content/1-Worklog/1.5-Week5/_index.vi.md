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

### Bài học rút ra
- SHAP values xác nhận trực giác kinh doanh: khuyến mãi và lịch sử doanh số gần đây là features dự báo tốt nhất
- Luôn viết `inference.py` riêng biệt với code training — file này sẽ vào SageMaker container
- Lưu metadata model dưới dạng JSON trên S3 khi không có registry quota — workaround thực tế
