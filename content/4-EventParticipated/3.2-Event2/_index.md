---
title: "Sự kiện 2 — AWS Study Group Weekly Session"
date: 2026-07-15
weight: 2
chapter: false
pre: "<b>3.2. </b>"
---

## Sự kiện 2: AWS Study Group Weekly Technical Session

**Tên sự kiện:** AWS Study Group — Weekly Technical Workshop  
**Thời gian:** 15/07/2026  
**Địa điểm:** Trực tuyến (Zoom)  
**Đơn vị tổ chức:** AWS Study Group Vietnam  
**Vai trò:** Người tham dự & Chia sẻ phần Hỏi đáp (Q&A)

---

### Tổng quan sự kiện

AWS Study Group tổ chức các buổi trao đổi kỹ thuật trực tuyến hàng tuần nơi các chuyên gia và học viên chia sẻ kiến thức về dịch vụ AWS. Buổi chia sẻ này tập trung vào **SageMaker Endpoints và các mô hình Serverless Inference** — trực tiếp liên quan đến công việc triển khai ở Tuần 6 của nhóm.

### Nội dung buổi chia sẻ

| Chủ đề | Thời lượng |
|--------|------------|
| Các mô hình triển khai SageMaker Endpoint | 30 phút |
| Tích hợp AWS Lambda với SageMaker | 20 phút |
| Thực thi bảo mật IAM cho công việc ML | 20 phút |
| Thảo luận & Hỏi đáp (Q&A) | 30 phút |

### Các bài học ứng dụng vào Dự án

1. **URI Container Image:** Xác nhận phương pháp sử dụng `sagemaker.image_uris.retrieve()` để lấy ECR URI chuẩn theo Region. Điều này đã giải quyết triệt để lỗi `ValidationException` ở Tuần 6.
2. **Cấu hình Timeout Lambda:** Thiết lập thời gian chờ 30 giây cho Lambda khi gọi SageMaker Endpoint để xử lý tình huống Cold Start.
3. **Quyền tối thiểu IAM:** Áp dụng mẫu IAM Policy giới hạn phạm vi cho `SageMaker-ExecutionRole-QuanVan`.
4. **Dọn dẹp tài nguyên:** Nhấn mạnh tầm quan trọng của script dọn dẹp tự động — củng cố việc nhóm xây dựng script `cleanup.py`.

### Đóng góp cá nhân

Trong phần Hỏi đáp, tôi đã chia sẻ trải nghiệm thực tế của nhóm về:
- Xử lý lỗi lệch phiên bản XGBoost (Version Mismatch) gây lỗi HTTP 500.
- Kinh nghiệm áp dụng hàm biến đổi ngược `np.expm1()`.
- Phương án linh hoạt sử dụng tài khoản cá nhân khi gặp giới hạn Service Quota.
