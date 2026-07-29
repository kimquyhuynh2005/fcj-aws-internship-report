---
title: "Blog 3: Từ Local Notebook đến MLOps Thực Chiến: Hành trình \"thuần phục\" AWS SageMaker Pipelines"
date: 2026-06-06
weight: 3
chapter: false
pre: "<b>3.3. </b>"
---

> **Tác giả:** Văn Thái Quân  
> **Chuyên mục:** Machine Learning Engineering / MLOps  
> **Cộng đồng:** AWS Study Group  
> **Dự án:** E-commerce Sales Forecasting on AWS SageMaker  

---

## Từ Local Notebook đến MLOps Thực Chiến: Hành trình triển khai AWS SageMaker Pipelines

Trong giai đoạn đầu nghiên cứu Machine Learning, các kỹ sư thường thực thi thử nghiệm trong môi trường Jupyter Notebook—từ công đoạn tiền xử lý dữ liệu, huấn luyện mô hình đến đánh giá kết quả. Tuy nhiên, khi triển khai ứng dụng trong môi trường doanh nghiệp, bài toán đặt ra là: *Làm thế nào để tự động hóa toàn bộ quy trình công việc (workflow) một cách ổn định, có khả năng mở rộng (scale) và cung cấp giao diện lập trình ứng dụng (REST API) cho các hệ thống phụ trợ khai thác?*

Dự án dự báo doanh số bán lẻ Rossmann trên nền tảng AWS đã được thiết kế nhằm giải quyết bài toán trên. Bài viết này trình bày kiến trúc tổng thể và các bài học thực tiễn rút ra từ quá trình xây dựng hệ thống MLOps.

---

## 1. Kiến trúc hệ thống MLOps 3 lớp

Hệ thống được thiết kế theo mô hình phân lớp rõ ràng nhằm tách biệt các giai đoạn trong vòng đời mô hình:

### Lớp 1: Data Lake & Baseline Modeling (Chuẩn bị dữ liệu)
- **Kho lưu trữ trung tâm:** Dữ liệu thô (raw data) được lưu trữ trên dịch vụ **Amazon S3 Bucket**.
- **Tiền xử lý & Đánh giá mô hình:** Dữ liệu được trích xuất và phân chia thành các tập `train.csv`, `val.csv`, và `test.csv`. Qua thử nghiệm thực nghiệm, thuật toán XGBoost đạt chỉ số sai số tuyệt đối phần trăm trung bình (MAPE) **9.92%**, vượt trội so với kiến trúc Deep Learning PyTorch LSTM (MAPE **32.79%**), từ đó được chọn làm mô hình chuẩn cho hệ thống.

### Lớp 2: Continuous Integration với SageMaker Pipelines (Tự động hóa huấn luyện)
Đây là thành phần cốt lõi của quy trình MLOps. Luồng huấn luyện được đóng gói qua **SageMaker Pipelines** mang tên `Rossmann-Sales-Pipeline`:
- Mã nguồn tiền xử lý và cấu hình huấn luyện được đóng gói thành các tập tin lưu trữ (`sourcedir.tar.gz`) và đẩy lên S3, đảm bảo tính tự đóng gói (self-contained) của tiến trình.
- Pipeline tự động cấp phát tài nguyên điện toán, truy xuất dữ liệu từ S3, thực thi kịch bản huấn luyện XGBoost và tự động lưu trữ sản phẩm mô hình (Model Artifact) vào S3.

### Lớp 3: Continuous Deployment & Serving (Phục vụ thời gian thực)
Để đưa mô hình vào phục vụ thực tế, hạ tầng được tích hợp giải pháp **Serverless REST API** kết hợp giữa **Amazon API Gateway** và **AWS Lambda**:
- AWS Lambda đóng vai trò trung gian xử lý, nhận yêu cầu payload từ API Gateway và gọi API `sagemaker-runtime.invoke_endpoint` tới SageMaker Endpoint để trả về kết quả dự báo định dạng JSON.
- Mô hình khi kiểm thử thực tế trên dữ liệu thực (Quality Gate) đạt mức sai số ấn tượng chỉ **4.75%**.

---

## 2. Các thách thức kỹ thuật và giải pháp thực tiễn

Trong quá trình triển khai hạ tầng trên điện toán đám mây, nhóm phát triển đã ghi nhận 3 bài học kỹ thuật quan trọng:

- **Quản lý giới hạn tài nguyên (Service Quotas):** Mặc định, tài khoản AWS có thể thiết lập hạn mức quota của `SageMaker Training Jobs` bằng 0. Cần chủ động kiểm tra và gửi yêu cầu nâng hạn mức (Quota Increase Request) cho loại máy chủ tương ứng (ví dụ: `ml.m5.large`) qua AWS Support trước khi vận hành pipeline.
- **Quản lý xung đột thư viện (Dependency Pinning):** Cần ấn định chính xác phiên bản các thư viện phụ thuộc (ví dụ: `sagemaker==2.257.5`) trong môi trường thực thi để tránh hiện tượng không tương thích (Dependency Hell) khi AWS tự động cập nhật SDK.
- **Tối ưu chi phí vận hành máy chủ Endpoint:** Khác với mô hình serverless tính phí theo lượt gọi như Lambda, SageMaker Endpoint duy trì máy chủ hoạt động liên tục và tính phí theo giờ. Do đó, cần xây dựng các kịch bản dọn dẹp tự động (`cleanup.py`) để giải phóng tài nguyên ngay sau khi hoàn tất giai đoạn thử nghiệm.

---

## 3. Kết luận

Chuyển đổi quy trình phát triển mô hình từ Jupyter Notebook cục bộ sang hệ thống MLOps tự động hóa với AWS SageMaker Pipelines đòi hỏi tư duy toàn diện về kiến trúc hạ tầng, quản lý chi phí và xử lý sự cố. Khi được thiết lập chuẩn xác, hệ thống mang lại khả năng vận hành tự động, linh hoạt và đáp ứng các tiêu chuẩn khắt khe trong môi trường doanh nghiệp.
