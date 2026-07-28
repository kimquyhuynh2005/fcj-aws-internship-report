---
title: "Tuần 3 — XGBoost Baseline + LSTM Skeleton"
date: 2026-06-20
weight: 3
chapter: false
pre: "<b>1.3. </b>"
---

## Tuần 3 — XGBoost Baseline + LSTM Skeleton ✅

**Người thực hiện:** Huỳnh Kim Quý | **Thời gian:** 20/06/2026 – 26/06/2026

---

### Công việc đã làm

1. **Train XGBoost Baseline**
   - Train local dùng XGBoost 1.7.6 với hyperparameters: `n_estimators=500, max_depth=6, learning_rate=0.05`
   - Log experiment lên SageMaker Experiments qua boto3
   - Upload model artifact lên S3

2. **Kết quả XGBoost**

| Metric | Validation | Test |
|--------|-----------|------|
| RMSE | 941.21 | **925.28** |
| MAPE | 9.92% | **9.92%** |

3. **LSTM Skeleton**
   - Tạo `model.py` — kiến trúc PyTorch LSTM
   - Tạo `dataset.py` — class TimeSeriesDataset
   - Unit test pass: forward pass, kiểm tra shape

4. **Log SageMaker Experiments bằng boto3 (workaround)**
   `python
   sm_client = boto3.client('sagemaker', region_name='ap-southeast-1')
   # Log metrics trực tiếp vì SageMaker SDK 3.x bị lỗi
   sm_client.batch_put_metrics(...)
   `

---

### Bài học rút ra
- XGBoost với 22 features thủ công vượt xa kỳ vọng
- SageMaker SDK 3.x bị lỗi → dùng `boto3.client()` trực tiếp (ổn định hơn)
- Luôn pin XGBoost version — lệch version giữa train và serve là lỗi thực tế đã gặp
