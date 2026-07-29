---
title: "Blog 3: Từ Local Notebook đến MLOps Thực Chiến: Hành trình \"thuần phục\" AWS SageMaker Pipelines"
date: 2026-06-06
weight: 3
chapter: false
pre: "<b>3.3. </b>"
---

> **Tác giả:** Huỳnh Kim Quý  
> **Chuyên mục:** Machine Learning Engineering / MLOps  
> **Cộng đồng:** AWS Study Group  
> **Dự án:** E-commerce Sales Forecasting on AWS SageMaker  

---

## Từ Local Notebook đến MLOps Thực Chiến: Hành trình "thuần phục" AWS SageMaker Pipelines

Khi mới làm quen với Machine Learning, chúng ta thường quen với việc chạy mọi thứ trên Jupyter Notebook: từ tiền xử lý dữ liệu, huấn luyện mô hình đến đánh giá kết quả. Nhưng khi bước vào môi trường doanh nghiệp, bài toán đặt ra là: *Làm sao để tự động hóa toàn bộ luồng công việc này một cách ổn định, dễ dàng scale và phơi bày (expose) mô hình ra cho các ứng dụng khác gọi được?*

Đó là lúc mình quyết định đưa toàn bộ dự án dự báo doanh số (dựa trên tập dữ liệu Rossmann Store Sales) lên AWS. Dưới đây là kiến trúc và những bài học thực tế từ quá trình chuyển đổi này.

---

## 1. Kiến trúc hệ thống MLOps 3 lớp

Thay vì làm thủ công, hệ thống được thiết kế để chia tách rõ ràng vòng đời của mô hình thành 3 giai đoạn độc lập:

### Lớp 1: Data Lake & Baseline Modeling (Chuẩn bị dữ liệu)
- Mọi thứ bắt đầu bằng việc đưa dữ liệu thô (raw data) lên **Amazon S3 Bucket** đóng vai trò là kho lưu trữ trung tâm.
- Dữ liệu được tiền xử lý thành các tập `train.csv`, `val.csv`, và `test.csv`. Ở giai đoạn thử nghiệm mô hình, thuật toán XGBoost tỏ ra vượt trội với mức sai lệch (MAPE) chỉ **9.92%**, áp đảo hoàn toàn so với mô hình Deep Learning là PyTorch LSTM (MAPE lên tới 32.79%). XGBoost chính thức được chọn làm mô hình "cốt lõi".

### Lớp 2: Continuous Integration với SageMaker Pipelines (Tự động hóa huấn luyện)
Đây là trái tim của hệ thống MLOps. Mình sử dụng **SageMaker Pipelines** để định nghĩa một luồng huấn luyện tĩnh mang tên `Rossmann-Sales-Pipeline`. 
- Mỗi khi có thay đổi, code tiền xử lý và cấu hình huấn luyện sẽ được tự động đóng gói thành file `sourcedir.tar.gz` và đẩy lên S3. Việc này giúp Pipeline hoàn toàn tự chủ (self-contained).
- Pipeline sẽ tự động cấp phát máy chủ ảo, kéo dữ liệu từ S3, chạy script huấn luyện XGBoost và cuối cùng là lưu trữ (Model Artifact) ngược lại S3 một cách gọn gàng.

### Lớp 3: Continuous Deployment & Serving (Phục vụ thời gian thực)
Mô hình dù tốt đến đâu nếu chỉ nằm trên S3 thì cũng vô nghĩa. Tuy nhiên, SageMaker Endpoint lại không thể gọi trực tiếp bằng các HTTP Request thông thường (REST) từ bên ngoài.
- Để giải quyết, mình dựng thêm một lớp **Serverless REST API** kết hợp giữa **Amazon API Gateway** và **AWS Lambda**.
- Lambda đóng vai trò trung gian, nhận payload từ API Gateway và gọi API `sagemaker-runtime.invoke_endpoint` để ép mô hình đưa ra dự báo, sau đó trả về kết quả JSON chuẩn hóa. Mô hình khi chạy thực tế trên dữ liệu thật (Quality Gate) đạt mức sai số cực kỳ ấn tượng: chỉ **4.75%**.

---

## 2. Những bài học "đau thương" nhưng đáng giá

Kiến trúc nghe thì trơn tru, nhưng thực tế triển khai trên Cloud hiếm khi là một con đường trải hoa hồng. Dưới đây là 3 điểm mấu chốt bạn nhất định phải lưu tâm:

- **Giới hạn tài nguyên (Service Quotas) không chừa một ai:** Ban đầu, toàn bộ Pipeline của mình bị "đóng băng" vì tài khoản AWS mặc định giới hạn quota của `SageMaker Training Jobs` bằng 0. Mình đã phải tạo yêu cầu tăng quota cho instance `ml.m5.large` lên AWS Support và chờ được phê duyệt. **Mẹo:** Khi gặp lỗi cấp phát tài nguyên, hãy check Quota Dashboard trước thay vì hì hục sửa code.
- **Dependency Hell (Xung đột thư viện):** Đừng bao giờ cài đặt kiểu `pip install sagemaker` mà không ghim cứng phiên bản (version pinning). Hệ thống của mình từng vỡ vụn với lỗi `ModuleNotFoundError` do AWS tự động kéo bản SDK mới nhất gây xung đột nội bộ. Việc chốt cứng `sagemaker==2.257.5` đã cứu rỗi cả dự án.
- **Chi phí ẩn từ SageMaker Endpoint:** Khác với Lambda chỉ tính tiền khi chạy, SageMaker Endpoint (ví dụ máy `ml.t2.medium`) sẽ **bào tiền bạn theo giờ liên tục** kể từ khi nó được bật lên. Trừ phi dự án đang chạy production phục vụ khách hàng, hãy luôn viết một kịch bản `cleanup.py` để tự động xóa Endpoint ngay sau khi demo hoặc test xong.

---

## 3. Lời kết

Việc đưa một mô hình từ Jupyter Notebook lên thành một hệ thống MLOps tự động với SageMaker Pipelines đòi hỏi tư duy về hạ tầng, quản lý chi phí và xử lý lỗi hệ thống rất nhiều. Tuy nhiên, một khi đã thiết lập thành công, bạn sẽ sở hữu một cỗ máy tự động hóa trơn tru, có khả năng mở rộng mạnh mẽ và đáp ứng tiêu chuẩn khắt khe của doanh nghiệp.
