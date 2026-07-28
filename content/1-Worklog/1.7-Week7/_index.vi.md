---
title: "Tuần 7 — Monitoring + Drift Detection"
date: 2026-07-18
weight: 7
chapter: false
pre: "<b>1.7. </b>"
---

## Tuần 7 — Monitoring + Drift Detection ✅

**Người thực hiện:** Nguyễn Ngọc Sáng | **Thời gian:** 18/07/2026 – 24/07/2026

---

### Bối cảnh
Model XGBoost đã deploy ở tuần 6. Dataset Rossmann kết thúc năm 2015 — không có data mới thực tế để monitor. Giải pháp: viết `drift_simulator.py` tự tạo dữ liệu bất thường để kiểm tra hệ thống monitoring.

### Công việc đã làm

1. **Tạo baseline statistics từ train data**
   - Đọc `week2_preprocessing/data/processed/train.csv`
   - Tính mean, std, min, max, count cho 5 features quan trọng nhất (theo SHAP): `Store`, `DayOfWeek`, `Promo`, `CompetitionDistance`, `Month`
   - Lưu thành `week7_monitoring/baseline_stats.json`
   - Upload S3: `ml-forecasting/monitoring/baseline/`

2. **Viết `drift_simulator.py`**
   - 2 loại drift được mô phỏng:

   | Loại | Thay đổi | Ý nghĩa thực tế |
   |------|---------|----------------|
   | `shift` | CompetitionDistance × 3, Promo → 80% | Thị trường cạnh tranh tăng mạnh |
   | `noise` | DayOfWeek random | Lỗi data pipeline |

3. **Phát hiện drift bằng z-score**
   ```
   z_score = |mean_new - mean_baseline| / std_baseline
   Alert khi z_score > 2.0
   ```

4. **Tạo CloudWatch Dashboard**
   - Dashboard: `RossmannForecastingDashboard`
   - Widgets: Request count, Lambda duration & error rate, Drift Detection Status

---

### Kết quả đạt được

**Drift Detection:**

| Scenario | Alerts | Kết quả |
|---------|--------|--------|
| Normal data (test set gốc) | 0 alerts | ✅ Không false alarm |
| Drifted data (shift type) | 2 alerts | ✅ Phát hiện đúng |

**Chi tiết drift detected:**

| Feature | Baseline Mean | Current Mean | z-score | Status |
|---------|--------------|-------------|---------|--------|
| CompetitionDistance | 5,430.34 | 16,291.02 | 6.83 | ⚠️ DRIFT |
| Promo | 0.38 | 0.80 | 4.21 | ⚠️ DRIFT |
| Store | 558.43 | 558.43 | 0.00 | ✅ OK |
| DayOfWeek | 3.99 | 4.00 | 0.01 | ✅ OK |
| Month | 7.22 | 7.22 | 0.01 | ✅ OK |

---

### Bài học rút ra
- Khi không có data mới, `drift_simulator.py` là chiến lược kiểm tra monitoring hợp lệ và thực tế
- z-score threshold = 2.0 là ngưỡng thống kê chuẩn cho anomaly detection
- CloudWatch dashboard cung cấp khả năng giám sát tình trạng model một cách trực quan
