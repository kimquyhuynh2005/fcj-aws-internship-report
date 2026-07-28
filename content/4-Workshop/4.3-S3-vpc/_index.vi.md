---
title: "3. Tiền xử lý Dữ liệu"
date: 2026-06-06
weight: 3
chapter: false
pre: "<b>4.3. </b>"
---

## Bước 3: Tiền xử lý Dữ liệu & Tạo Đặc trưng

### Tổng quan Bộ dữ liệu Rossmann

```
Rossmann Store Sales
├── train.csv    — 1,017,209 dòng × 9 cột
└── store.csv    — 1,115 dòng × 10 cột (metadata cửa hàng)
```

### Chạy Tiền xử lý Dữ liệu

```bash
python week2_preprocessing/preprocessing.py
```

### Các bước xử lý chính:

1. **Gộp bộ dữ liệu:** Gộp thông tin cửa hàng `store.csv` vào tập giao dịch `train.csv` theo `Store ID`.
2. **Lọc dữ liệu đóng cửa:** Loại bỏ 172,817 dòng khi cửa hàng đóng cửa (`Open = 0`) hoặc doanh số bằng 0.
3. **Tạo 22 đặc trưng (Feature Engineering):**
   - Đặc trưng thời gian: `Year`, `Month`, `Day`, `DayOfWeek`, `WeekOfYear`, `IsWeekend`, `IsDecember`.
   - Trung bình cuộn (Rolling Mean): `rolling_mean_7`, `rolling_mean_14`, `rolling_mean_30`.
   - Độ lệch lịch sử (Lag features): `sales_lag_7`, `sales_lag_14`, `sales_lag_30`.
4. **Phân chia dữ liệu theo thời gian (Chronological Split):**
   - Tập Train: Dữ liệu trước `2015-06-01` (785,727 dòng)
   - Tập Validation: Tháng 6/2015 (28,423 dòng)
   - Tập Test: Tháng 7/2015 (30,188 dòng)
