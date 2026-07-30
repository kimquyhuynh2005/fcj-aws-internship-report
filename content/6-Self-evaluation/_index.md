---
title: "Tự đánh giá"
date: 2026-06-06
weight: 6
chapter: false
pre: "<b>6. </b>"
---

# Tự đánh giá & Phản hồi Thực tập

Đánh giá chi tiết hiệu suất cá nhân, sự phát triển kỹ năng kỹ thuật, giải quyết sự cố và kết quả đạt được trong **8 tuần thực tập** thuộc chương trình AWS First Cloud AI Journey.

**Người đánh giá:** Huỳnh Kim Quý  
**Vị trí:** Data & Machine Learning Engineer Intern  
**Chương trình:** Workforce Bootcamp — First Cloud AI Journey (FCAJ)  
**Công ty:** Amazon Web Services Viet Nam Company Limited  
**Thời gian thực tập:** 06/06/2026 – 15/08/2026 (Tổng cộng 8 tuần thực tế)  

---

## 1. Bảng Đánh giá Tiêu chí Cá nhân (Evaluation Criteria Table)

Dưới đây là bảng đánh giá tổng hợp 8 tiêu chí chuyên môn dựa trên các kết quả và sản phẩm thực tế đã hoàn thành trong kỳ thực tập:

| # | Tiêu chí Đánh giá | Mức độ Đạt được | Mô tả Chi tiết & Minh chứng Thực tế |
|---|-------------------|-----------------|--------------------------------------|
| 1 | **Kiến thức AWS Kỹ thuật** | **Tốt (Good)** | Thành thạo và triển khai thực tế 7 dịch vụ AWS cốt lõi: Amazon S3 (Bucket Policies, Data Lake Architecture), AWS IAM (Least Privilege Roles), Amazon SageMaker (Endpoint Deployment, Experiments Tracking, Pipelines), AWS Lambda, Amazon API Gateway, Amazon CloudWatch Dashboard. |
| 2 | **Kỹ năng Machine Learning** | **Tốt (Good)** | Trích xuất thành công 22 đặc trưng chuỗi thời gian (Rolling Means 7/14/30, Lag features 7/14/30, Calendar Features); huấn luyện mô hình XGBoost Regressor (v1.7.6) đạt chỉ số ấn tượng: Test RMSE **925.28** và Test MAPE **9.92%** (vượt xa mục tiêu RMSE ~1,200). |
| 3 | **Giải quyết Vấn đề & Debug** | **Tốt (Good)** | Chẩn đoán và xử lý dứt điểm 3 sự cố phức tạp: Yêu cầu mở nâng Service Quota cho SageMaker Training Jobs, ấn định phiên bản `sagemaker==2.257.5` giải quyết xung đột SDK, và sửa lỗi tràn số vô cùng (Infinity) khi sử dụng hàm biến đổi log `np.expm1()`. |
| 4 | **Chất lượng Code & Kiến trúc** | **Khá (Fair)** | Mã nguồn được tổ chức mô-đun hóa sạch sẽ, tuân thủ nguyên tắc tự đóng gói (self-contained) với `sourcedir.tar.gz`. Cần tiếp tục mở rộng viết Unit Tests tự động để tăng độ bao phủ mã nguồn. |
| 5 | **Làm việc Nhóm & Hợp tác** | **Tốt (Good)** | Phân công và phối hợp nhịp nhàng giữa 3 thành viên (Data/ML: Huỳnh Kim Quý, Backend: Nguyễn Ngọc Sáng, Infrastructure: Văn Thái Quân); giao tiếp kỹ thuật minh bạch và họp trao đổi định kỳ. |
| 6 | **Quản lý Thời gian** | **Khá (Fair)** | Hoàn thành 100% các cột mốc công việc trong suốt 8 tuần thực tập. Tiến độ Tuần 6 từng bị chậm do xử lý quota nhưng đã chủ động tăng tốc hoàn thành đúng thời hạn. |
| 7 | **Tài liệu Kỹ thuật** | **Tốt (Good)** | Xuất bản 3 bài viết Blog kỹ thuật chuyên sâu trên cộng đồng AWS Study Group, đồng thời xây dựng tài liệu thực hành Workshop hoàn chỉnh (`Workshop_AWS_ML_Forecasting.md`). |
| 8 | **Chủ động & Sáng kiến** | **Tốt (Good)** | Chủ động phát hiện rào cản tài nguyên đám mây sớm; đề xuất kiến trúc Serverless REST API kết hợp AWS Lambda + API Gateway để expose SageMaker Endpoint ra công cộng an toàn. |

> **Thang điểm danh giá:** **Tốt (Good)** > **Khá (Fair)** > **Trung bình (Average)**

---

## 2. Chi tiết Kỹ năng Kỹ thuật Tích lũy

### 2.1. Hạ tầng Điện toán Đám mây AWS (Hands-on Cloud Services)
- ✅ **Amazon S3:** Thiết kế kiến trúc Data Lake phân lớp (`raw/`, `processed/`, `models/`), cấu hình Bucket Policies, quản lý Versioning và lập trình tương tác qua SDK `boto3`.
- ✅ **AWS IAM:** Khởi tạo Roles, Inline Policies tuân thủ nguyên tắc bảo mật Least Privilege cho SageMaker Execution Role và Lambda Execution Role.
- ✅ **Amazon SageMaker:** Triển khai máy chủ Endpoint (`ml.t2.medium`), ghi vết thí nghiệm với SageMaker Experiments và đóng gói workflow tự động hóa với SageMaker Pipelines.
- ✅ **AWS Lambda & API Gateway:** Dựng lớp Serverless REST API công khai đóng vai trò wrapper xử lý JSON payload và gọi `sagemaker-runtime.invoke_endpoint`.
- ✅ **Amazon CloudWatch:** Thiết lập Dashboard giám sát (`RossmannForecastingDashboard`), thu thập chỉ số độ trễ (latency), số lượng request và phát hiện trôi dữ liệu (Data Drift).

### 2.2. Kỹ thuật Machine Learning & Data Engineering
- ✅ **Feature Engineering Chuỗi Thời gian:** Xây dựng đặc trưng Rolling Means (7, 14, 30 ngày), Lag features và Calendar variables.
- ✅ **Tối ưu hóa Mô hình:** Huấn luyện XGBoost, tinh chỉnh siêu tham số bằng Optuna, áp dụng kỹ thuật ngắt sớm (Early Stopping) ngăn quá khớp.
- ✅ **Đánh giá & Trực quan hóa:** Đánh giá độ chính xác qua RMSE và MAPE; phân tích mức độ quan trọng đặc trưng bằng SHAP Values.
- ✅ **Kiểm định Chất lượng Dữ liệu:** Xây dựng thuật toán kiểm tra trôi thống kê Z-Score (Statistical Drift Detection) và ngăn ngừa rò rỉ dữ liệu (Data Leakage) bằng mốc phân chia thời gian nghiêm ngặt.

---

## 3. Cảm nhận Cá nhân & Bài học Tích lũy (Personal Reflection)

**8 tuần thực tập** tại chương trình AWS First Cloud AI Journey đã vượt xa kỳ vọng ban đầu của tôi về một khóa đào tạo thực tiễn. Trải nghiệm quý giá nhất không chỉ nằm ở việc xây dựng thành công REST API hoạt động trơn tru—mà chính là **hành trình chẩn đoán và khắc phục sự cố kỹ thuật (Debugging Journey)**: từ việc phát hiện giới hạn quota máy chủ SageMaker, giải quyết xung đột phiên bản thư viện XGBoost, cho đến việc thấu hiểu cơ chế tràn số biến đổi log với `np.expm1()`.

Đây là những bài học thực chiến sâu sắc mà không sách vở hay khóa học lý thuyết nào có thể mang lại. Dự án thực tế trong doanh nghiệp luôn phát sinh các rào cản bất ngờ, và việc học cách chẩn đoán, đưa ra giải pháp khắc phục có hệ thống chính là kỹ năng cốt lõi của một Kỹ sư Điện toán Đám mây (Cloud Engineer).

> **Lời khuyên cho bản thân:** Luôn kiểm tra Service Quotas ngay trong ngày đầu tiên khởi tạo bất kỳ dự án AWS mới nào, và duy trì thói quen viết tài liệu kỹ thuật liên tục từ Tuần 1 thay vì dồn vào các tuần cuối.

---

## 4. Tổng hợp Đánh giá Hiệu suất

```
Kiến thức AWS:        ████████░░  Tốt (Good)
Kỹ năng ML:           ████████░░  Tốt (Good)
Giải quyết vấn đề:    ████████░░  Tốt (Good)
Chất lượng code:      ██████░░░░  Khá (Fair)
Làm việc nhóm:        ████████░░  Tốt (Good)
Quản lý thời gian:    ██████░░░░  Khá (Fair)
Tài liệu kỹ thuật:    ████████░░  Tốt (Good)
Tư duy chủ động:      ████████░░  Tốt (Good)
```

**ĐÁNH GIÁ TỔNG THỂ: TỐT / KHÁ XUẤT SẮC** (Hoàn thành 100% mục tiêu 8 tuần với các kết quả thực tế vượt mong đợi).