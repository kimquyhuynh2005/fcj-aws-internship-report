---
title: "Tuần 2 — Tiền xử lý dữ liệu & EDA"
date: 2026-06-13
weight: 2
chapter: false
pre: "<b>1.2. </b>"
---

## Tuần 2 — Tiền xử lý dữ liệu & EDA ✅

**Người thực hiện:** Huỳnh Kim Quý | **Thời gian:** 13/06/2026 – 19/06/2026

---

### Bối cảnh

Dataset Rossmann có 1,017,209 bản ghi từ 1,115 cửa hàng (2013–2015). EDA ban đầu phát hiện các patterns quan trọng cho feature engineering.

### Công việc đã làm

1. **Khám phá dữ liệu (EDA)**
   - Phát hiện **172,817 bản ghi cửa hàng đóng cửa** → loại bỏ khi train
   - Phân phối Sales bị lệch phải → áp dụng log-transform cho target
   - Doanh số tháng 12 luôn cao nhất → tính mùa vụ mạnh

2. **Kết quả EDA quan trọng**

| Phát hiện | Ý nghĩa |
|-----------|---------|
| Sales bị lệch phải | Áp dụng log-transform |
| Promo tăng Sales ~37% | Feature quan trọng nhất |
| Tháng 12 cao vượt trội | Tính mùa vụ mạnh |
| 172,817 bản ghi đóng cửa | Loại bỏ khi train |

3. **Feature Engineering**
   - Tạo rolling averages: `rolling_mean_7`, `rolling_mean_14`, `rolling_mean_30`
   - Tạo lag features: `lag_1`, `lag_7`, `lag_14`
   - Trích xuất date features: `DayOfWeek`, `Month`, `WeekOfYear`, `IsWeekend`
   - Tổng cộng: **22 features được tạo ra**

4. **Chia dữ liệu theo thứ tự thời gian**

| Split | Số dòng | Khoảng thời gian |
|-------|---------|-----------------|
| Train | 785,727 | 2013-01-01 → 2015-05-31 |
| Validation | 28,423 | 2015-06-01 → 2015-06-30 |
| Test | 30,188 | 2015-07-01 → 2015-07-31 |

5. **Upload lên S3**
   `
   s3://aws-internship-hkq-2026/ml-forecasting/data/processed/
   ├── train.csv
   ├── val.csv
   ├── test.csv
   └── scaler.pkl
   `

---

### Bài học rút ra
- Fit StandardScaler **chỉ trên train set**, rồi transform val/test → tránh data leakage
- Dataset kết thúc 2015-07-31 (không phải 2015-12-31 như kế hoạch) — luôn kiểm tra dữ liệu kỹ trước khi lập kế hoạch
- Target bị lệch phải nên dùng log-transform nhưng phải inverse-transform cẩn thận khi inference
