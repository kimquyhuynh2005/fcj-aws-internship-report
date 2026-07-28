---
title: "Tuần 1 — Setup môi trường AWS"
date: 2026-06-06
weight: 1
chapter: false
pre: "<b>1.1. </b>"
---

## Tuần 1 — Setup môi trường AWS ✅

**Người thực hiện:** Huỳnh Kim Quý | **Thời gian:** 06/06/2026 – 12/06/2026

---

### Công việc đã làm

1. **Tạo tài khoản AWS & cấu hình IAM**
   - Account ID: `119505195050` | Region: `ap-southeast-1` (Singapore)
   - Tạo IAM Role: `SageMaker-ExecutionRole-hkq` với Inline Policy theo Least Privilege
   - Giới hạn S3 access chỉ trên bucket `s3://aws-internship-hkq-2026`

2. **Tạo S3 Bucket**
   - Bucket: `s3://aws-internship-hkq-2026`
   - Bật versioning và cấu hình bucket policies

3. **Thiết lập môi trường phát triển**
   - Cấu hình AWS CLI với SSO login
   - Tạo Python virtual environment với `requirements.txt`
   - Viết `config.py` (tất cả S3 paths, ARNs, constants tập trung một chỗ)
   - Viết `verify_setup.py` để kiểm tra kết nối AWS

4. **Phát hiện vấn đề quota**
   - SageMaker Training Jobs quota = 0 trên account nhóm
   - Lập kế hoạch workaround: train local, log metrics qua boto3

---

### Kết quả đạt được

```
✅ AWS Account:  119505195050
✅ S3 Bucket:    s3://aws-internship-hkq-2026
✅ IAM Role:     SageMaker-ExecutionRole-hkq (Least Privilege)
✅ SageMaker:    API OK — region ap-southeast-1
✅ Python env:   venv activated, requirements installed
✅ verify_setup.py: ALL CHECKS PASSED
```

### Script khởi động
```powershell
cd "E:\AWS - TTNT\aws-internship-ML-forecasting"
.\venv\Scripts\activate
aws login   # Credentials hết hạn mỗi ~8 tiếng
python verify_setup.py
```

---

### Bài học rút ra
- Luôn kiểm tra SageMaker service quotas **trước** khi viết code — `check_quota.py` là công cụ không thể thiếu từ ngày đầu
- IAM Least Privilege phức tạp hơn tưởng; dùng inline policy thay managed policy để kiểm soát tốt hơn
- AWS SSO credentials hết hạn mỗi ~8 tiếng — cần đưa `aws login` vào quy trình làm việc nhóm
