---
title: "Cảm nhận"
date: 2026-06-06
weight: 6
chapter: false
pre: "<b>6. </b>"
---

# Cảm nhận — AWS First Cloud AI Journey

**Người gửi:** Huỳnh Kim Quý  
**Chương trình:** Workforce Bootcamp — First Cloud AI Journey  
**Công ty:** Amazon Web Services Viet Nam Company Limited  
**Thời gian:** 06/06/2026 – 15/08/2026

---

## Mức độ hài lòng tổng thể

**Đánh giá: 4/5** — Rất hài lòng với chương trình

---

## Điểm mạnh của chương trình

### 1. Tập trung vào dự án thực tế
Điểm nhấn của chương trình — xây dựng dự án thực thay vì chỉ làm theo hướng dẫn — là khía cạnh có giá trị nhất. Làm việc với dataset thực (Rossmann, hơn 1 triệu bản ghi) và gặp phải các giới hạn AWS thực tế (vấn đề quota, lỗi SDK) tạo ra trải nghiệm học tập không thể có từ các khóa học cấu trúc.

### 2. Học tập theo nhóm
Làm việc theo nhóm 3 người với phân công trách nhiệm riêng biệt (Data/ML, Infra/AWS, Backend) phản ánh sát quy trình làm việc thực tế trong ngành. Cấu trúc hợp tác này cải thiện đáng kể cả kỹ năng kỹ thuật lẫn kỹ năng giao tiếp.

### 3. Chiều sâu kỹ thuật
Chương trình bao quát toàn bộ vòng đời ML — từ tiền xử lý dữ liệu đến triển khai, giám sát và tự động hoá pipeline. Sự tiếp cận end-to-end này hiếm có trong môi trường học thuật.

### 4. Quyền truy cập tài nguyên AWS
Có quyền truy cập vào tài khoản AWS thực (dù có một số giới hạn quota) mang lại trải nghiệm cloud thực tế mà không môi trường mô phỏng nào có thể thay thế.

---

## Điểm cần cải thiện

### 1. Hướng dẫn về Service Quota
Nhóm tốn nhiều thời gian xử lý SageMaker service quotas = 0 trên account mới. Chương trình sẽ tốt hơn nếu:
- Có hướng dẫn kiểm tra quota trước Tuần 1
- Account được cấu hình trước với quota phù hợp cho học viên bootcamp

### 2. Tài liệu phiên bản SDK
SageMaker Python SDK gặp lỗi nghiêm trọng trong version 3.x. Danh sách dependencies được pin và test từ đầu chương trình sẽ tiết kiệm thời gian debug đáng kể.

### 3. Mentorship có cấu trúc hơn
Trong khi tự học có giá trị, các buổi code review hay Q&A kỹ thuật với AWS practitioners được lên lịch sẵn sẽ giúp giải quyết vấn đề nhanh hơn.

### 4. Check-in giữa chương trình
Đánh giá tiến độ có cấu trúc ở giữa (khoảng Tuần 4–5) sẽ giúp nhóm điều chỉnh sớm hơn thay vì phát hiện vấn đề ở Tuần 6–7.

---

## Lời khuyên cho học viên tương lai

Dựa trên 12 tuần trải nghiệm của mình, những lời khuyên hàng đầu cho học viên sắp tham gia:

1. **Kiểm tra service quotas từ Ngày 1** — chạy `check_quota.py` trước khi viết bất kỳ code nào
2. **Dùng boto3 trực tiếp** — ổn định hơn SageMaker SDK cho các workflow phức tạp
3. **Ghi chép liên tục** — đừng để documentation đến 4 tuần cuối
4. **Chấp nhận workaround** — kỹ thuật cloud thực tế là giải quyết vấn đề sáng tạo khi công cụ lý tưởng không có sẵn
5. **Cleanup endpoint ngay lập tức** — SageMaker Endpoint tính phí theo giờ kể cả khi không có request

---

## Kỹ năng sẽ áp dụng trong sự nghiệp

| Kỹ năng | Ứng dụng trực tiếp |
|---------|-------------------|
| IAM Least Privilege | Mọi dự án AWS |
| Patterns boto3 API | Tự động hoá cloud bằng Python |
| XGBoost + feature engineering | Dự án ML dạng bảng |
| Deploy SageMaker Endpoint | Hệ thống ML production |
| CloudWatch monitoring | Quan sát hệ thống production |
| IaC deployment scripts | Hạ tầng có thể lặp lại |

---

## Lời kết

Chương trình AWS First Cloud AI Journey cung cấp cho tôi trải nghiệm kỹ thuật cloud thực tế vượt xa những gì tôi có thể đạt được từ tự học hay các khóa học học thuật.

Bài học quan trọng nhất: **kỹ sư giỏi nhất không phải là người tránh được vấn đề — mà là người hiểu tại sao vấn đề xảy ra và sửa chúng một cách có hệ thống.**

Cảm ơn đội ngũ FCJ, AWS Vietnam và các thành viên nhóm (Văn Thái Quân và Nguyễn Ngọc Sáng) đã làm cho 12 tuần này trở nên đặc biệt.

---

*Huỳnh Kim Quý | kimquyhuynh2005@gmail.com | AWS062026*