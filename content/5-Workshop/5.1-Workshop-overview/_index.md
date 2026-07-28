---
title: "Tổng quan Workshop & Kiến trúc Dự án"
date: 2026-06-06
weight: 1
chapter: false
pre: "<b>5.1. </b>"
---

## Tổng quan Workshop

### Bối cảnh Dự án

**Rossmann Store Sales** là một trong những cuộc thi dự báo doanh số bán lẻ nổi tiếng nhất trên Kaggle. Bộ dữ liệu bao gồm:
- **1,017,209** bản ghi doanh số hàng ngày
- **1,115** cửa hàng trên toàn nước Đức
- **942** ngày lịch sử (Tháng 1/2013 – Tháng 7/2015)
- Các đặc trưng: khuyến mãi, khoảng cách đối thủ, loại cửa hàng, cơ cấu hàng hóa, ngày lễ

### Bài toán Kinh doanh

Các chuỗi bán lẻ cần dự báo doanh số hàng ngày chính xác để:

| Thách thức | Chưa có Dự báo | Có Dự báo Machine Learning |
|-----------|----------------|--------------------------|
| Hàng tồn kho | Thừa/thiếu hàng hóa | Tối ưu hóa mức tồn kho |
| Nhân sự | Phân công dư/thiếu | Đúng người, đúng thời điểm |
| Marketing | Khuyến mãi không hiệu quả | Thời điểm chiến dịch tối ưu |
| Tài chính | Bất ngờ về doanh thu | Doanh thu có thể dự báo |

### Kiến trúc Giải pháp

```
┌─────────────────────────────────────────────────────────┐
│                    TẦNG DỮ LIỆU                         │
│  Rossmann CSV → Amazon S3 (thô + đã xử lý)              │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    TẦNG MACHINE LEARNING                │
│  Tiền xử lý & Đặc trưng → Train XGBoost Baseline        │
│  22 đặc trưng: rolling_mean, lag, promo, date...        │
│  Kết quả: RMSE 925.28, MAPE 9.92%                       │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    TẦNG PHỤC VỤ (SERVING)               │
│  SageMaker Endpoint (ml.t2.medium)                      │
│  → AWS Lambda → API Gateway REST API                    │
│  → Endpoint công khai: /forecast POST                   │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    TẦNG GIÁM SÁT                        │
│  Kiểm tra trôi dữ liệu (Z-Score Drift Detection)        │
│  CloudWatch Dashboard: RossmannForecastingDashboard     │
└─────────────────────────────────────────────────────────┘
```

### Kết quả Thực tế Đạt được

```
Mô hình:           XGBoost (1.7.6)
Test RMSE:         925.28
Test MAPE:         9.92%
Độ chính xác API:  Sai số 5.14% trên dữ liệu thật (Store 1, 2015-06-15)
Độ độ trễ (API):   ~1.1 giây
Chi phí Endpoint:  ~$0.05/giờ (ml.t2.medium)
```
