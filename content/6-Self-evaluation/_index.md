---
title: "Tự đánh giá"
date: 2026-06-06
weight: 6
chapter: false
pre: "<b>6. </b>"
---

# Tự đánh giá

Đánh giá hiệu suất cá nhân và sự phát triển kỹ năng trong 8 tuần thực tập AWS First Cloud AI Journey.

**Người đánh giá:** Huỳnh Kim Quý  
**Thời gian:** 06/06/2026 – 15/08/2026

---

## Tiêu chí đánh giá

| # | Tiêu chí | Đánh giá | Ghi chú |
|---|---------|---------|---------|
| 1 | Kiến thức AWS kỹ thuật | **Tốt** | Thành thạo S3, IAM, SageMaker, Lambda, API Gateway, CloudWatch |
| 2 | Kỹ năng Machine Learning | **Tốt** | Train XGBoost đạt RMSE 925.28, MAPE 9.92% |
| 3 | Giải quyết vấn đề & Debug | **Tốt** | Giải quyết 3 lỗi deploy thực tế; nhiều workaround quota |
| 4 | Chất lượng code | **Khá** | Code hoạt động nhưng documentation chưa nhất quán |
| 5 | Làm việc nhóm | **Tốt** | Phân công công việc hiệu quả; giao tiếp rõ ràng |
| 6 | Quản lý thời gian | **Khá** | Hầu hết deliverables đúng hạn; tuần 6 chậm hơn kế hoạch |
| 7 | Tài liệu | **Khá** | Cải thiện đáng kể trong tuần 9–12 |
| 8 | Chủ động & sáng kiến | **Tốt** | Phát hiện vấn đề quota sớm; đề xuất workaround |

**Thang điểm:** Tốt > Khá > Trung bình

---

## Kỹ năng kỹ thuật đạt được

### AWS Services (thực hành)
- ✅ **Amazon S3** — tạo bucket, policies, versioning, boto3 upload/download
- ✅ **AWS IAM** — roles, inline policies, thiết kế Least Privilege
- ✅ **Amazon SageMaker** — deploy Endpoint, đóng gói model, Experiments tracking
- ✅ **AWS Lambda** — tạo function, IaC deployment, tích hợp SageMaker
- ✅ **Amazon API Gateway** — REST API, Lambda Proxy, deploy stage
- ✅ **Amazon CloudWatch** — tạo dashboard, metrics, log groups
- ✅ **SageMaker Pipelines** — Pipeline definition JSON, tạo bằng boto3

### Kỹ năng ML/Data Engineering
- ✅ Feature engineering cho time series (rolling means, lags, date features)
- ✅ Train XGBoost, hyperparameter tuning, early stopping
- ✅ Đánh giá model: RMSE, MAPE
- ✅ Phân tích SHAP feature importance
- ✅ Phát hiện drift thống kê (z-score)
- ✅ Ngăn data leakage (chronological splits, scaling đúng cách)
- 🔄 PyTorch LSTM (triển khai cơ bản, cần cải thiện)

---

## Thành tựu nổi bật

1. **Kết quả model tốt nhất:** RMSE 925.28, MAPE 9.92% — vượt mục tiêu ban đầu RMSE ~1,200
2. **Deploy Production:** REST API hoạt động với sai lệch 5.14% trên dữ liệu thật
3. **Debug thực tế:** Giải quyết 3 lỗi deploy cụ thể với phân tích nguyên nhân gốc
4. **Workaround thực dụng:** Xử lý giới hạn quota mà không làm chậm tiến độ dự án
5. **Chia sẻ kiến thức:** Đăng 3 bài blog kỹ thuật và trình bày tại Q&A AWS Study Group

---

## Điểm cần cải thiện

1. **Deep Learning:** LSTM cần chuẩn hoá đầu vào tốt hơn và train lâu hơn
2. **Testing:** Nên viết unit tests nhiều hơn trong suốt dự án
3. **Documentation:** Bắt đầu viết tài liệu quá muộn (tuần 9 thay vì liên tục từ đầu)
4. **Tối ưu chi phí:** Nên dùng Spot Instances cho các training experiments

---

## Cảm nhận cá nhân

12 tuần thực tập vượt xa kỳ vọng của tôi về học tập thực tế. Kinh nghiệm có giá trị nhất không phải là REST API hoạt động cuối cùng — mà là hành trình debug: phát hiện giới hạn quota, giải quyết xung đột XGBoost version, và hiểu tại sao `np.expm1()` gây ra kết quả Infinity.

Đây là những bài học mà không tutorial nào có thể dạy được. Dự án thực tế gặp lỗi theo những cách bất ngờ, và học cách chẩn đoán và sửa những lỗi đó chính là kỹ năng cốt lõi của một cloud engineer.

**Nếu làm lại:** Kiểm tra service quotas ngay ngày đầu tiên của bất kỳ dự án AWS mới nào, và bắt đầu viết tài liệu từ tuần 1 — không phải tuần 9.

---

## Tổng hợp đánh giá

```
Kiến thức AWS:        ████████░░  Tốt
Kỹ năng ML:           ████████░░  Tốt
Giải quyết vấn đề:    ████████░░  Tốt
Chất lượng code:      ██████░░░░  Khá
Làm việc nhóm:        ████████░░  Tốt
Quản lý thời gian:    ██████░░░░  Khá
Tài liệu:             ██████░░░░  Khá
Chủ động:             ████████░░  Tốt
```

**Đánh giá tổng: Khá** (trên mức trung bình, với các lĩnh vực phát triển rõ ràng)