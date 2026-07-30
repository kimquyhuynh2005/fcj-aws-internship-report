---
title: "Cảm nhận & Đề xuất"
date: 2026-06-06
weight: 7
chapter: false
pre: "<b>7. </b>"
---

# Cảm nhận & Đề xuất — AWS First Cloud AI Journey

Tổng kết cảm nhận, đánh giá chương trình thực tập và các đề xuất chuyên môn dựa trên **8 tuần trải nghiệm thực tế** tại chương trình AWS First Cloud AI Journey.

**Người gửi:** Huỳnh Kim Quý  
**Vị trí:** Data & Machine Learning Engineer Intern  
**Chương trình:** Workforce Bootcamp — First Cloud AI Journey (FCAJ)  
**Công ty:** Amazon Web Services Viet Nam Company Limited  
**Thời gian:** 06/06/2026 – 15/08/2026 (8 tuần thực tập)  

---

## 1. Mức độ Hài lòng Tổng thể (Overall Satisfaction)

**Đánh giá: 4.8 / 5.0** — *Rất hài lòng với chương trình đào tạo và môi trường làm việc thực tế tại AWS Viet Nam.*

---

## 2. Điểm mạnh Nổi bật của Chương trình

### 2.1. Tiếp cận Dự án Thực tế (Real-World Project Focus)
Điểm nhấn giá trị nhất của chương trình là học thông qua việc trực tiếp xây dựng sản phẩm thật thay vì chỉ thực hành theo bài mẫu có sẵn. Việc trực tiếp xử lý bộ dữ liệu thương mại điện tử lớn (Rossmann Store Sales với hơn 1 triệu bản ghi) và đối mặt với các rào cản tài nguyên đám mây thực tế (Service Quotas, IAM Permission Boundary) giúp sinh viên tích lũy năng lực giải quyết sự cố mà không môi trường lý thuyết nào có thể thay thế.

### 2.2. Mô hình Hợp tác Theo Nhóm (Cross-Functional Team Collaboration)
Mô hình làm việc nhóm 3 người với sự phân công vai trò rõ ràng:
- **Data & Machine Learning Engineer:** Huỳnh Kim Quý
- **Backend & Monitoring Engineer:** Nguyễn Ngọc Sáng
- **Infrastructure & AWS Cloud Engineer:** Văn Thái Quân

Sự phân vai này mô phỏng chính xác quy trình phát triển sản phẩm MLOps tại các tập đoàn công nghệ lớn, giúp cải thiện đồng thời cả tư duy kỹ thuật lẫn kỹ năng làm việc nhóm.

### 2.3. Chiều sâu Kiến trúc MLOps End-to-End
Chương trình bao quát toàn diện bức tranh MLOps hiện đại: từ bước làm sạch dữ liệu, trích xuất 22 đặc trưng chuỗi thời gian, huấn luyện mô hình (XGBoost vs PyTorch LSTM), ghi vết thí nghiệm (SageMaker Experiments), đóng gói tự động (SageMaker Pipelines), đến triển khai phục vụ thực tế (AWS Lambda + API Gateway) và giám sát trôi dữ liệu (CloudWatch Monitoring).

### 2.4. Trải nghiệm Tài nguyên Điện toán Đám mây AWS Thực tế
Sinh viên được cấp quyền thao tác trực tiếp trên hạ tầng đám mây AWS thực tế, giúp rèn luyện tư duy quản lý chi phí vận hành, bảo mật Least Privilege và nắm vững phương thức giao tiếp qua AWS SDK `boto3`.

---

## 3. Các Đề xuất Cải thiện cho Chương trình (Recommendations)

### 3.1. Hướng dẫn và Chuẩn bị Service Quotas từ Ngày Đầu
Trong quá trình làm việc, nhóm đã dành thời gian xử lý sự cố SageMaker Service Quotas = 0 đối với các tài khoản thử nghiệm mới. Đề xuất chương trình:
- Bổ sung tài liệu hướng dẫn kiểm tra và gửi yêu cầu nâng hạn mức Service Quotas ngay trong tuần onboarding (Tuần 1).
- Hỗ trợ cấp phát trước hạn mức quota phù hợp cho các instance huấn luyện chuyên dụng (`ml.m5.large`, `ml.t2.medium`).

### 3.2. Chuẩn hóa Bộ Thư viện Phụ thuộc (Dependency Version Pinning)
Do SageMaker Python SDK có sự thay đổi giữa các phiên bản (đặc biệt v2.x và v3.x), đề xuất công ty cung cấp tập tin `requirements.txt` chuẩn được kiểm thử sẵn ngay từ đầu dự án để giúp thực tập sinh tiết kiệm thời gian debug xung đột thư viện.

### 3.3. Tăng cường các Buổi Code Review Định kỳ
Bên cạnh tinh thần tự nghiên cứu, việc bổ sung các buổi kiểm tra mã nguồn (Code Review) hoặc hỏi đáp kỹ thuật định kỳ với các chuyên gia AWS (AWS Certified Solutions Architects / ML Specialists) sẽ giúp sinh viên tối ưu hóa cấu trúc mã nguồn tốt hơn.

---

## 4. Lời khuyên Kinh nghiệm cho Thực tập sinh Khóa sau

Dựa trên **8 tuần trải nghiệm thực tế**, dưới đây là 5 lời khuyên kinh nghiệm quý báu cho các bạn sinh viên tham gia khóa sau:

1. **Kiểm tra Service Quotas từ Ngày 1:** Luôn thực thi kịch bản kiểm tra quota AWS trước khi tiến hành viết mã nguồn huấn luyện.
2. **Ưu tiên sử dụng API `boto3` trực tiếp:** Tăng tính chủ động và độ ổn định cho các luồng công việc phức tạp thay vì phụ thuộc hoàn toàn vào High-level SDK.
3. **Duy trì Viết Tài liệu Kỹ thuật Liên tục:** Ghi chép ngay các bước triển khai và sự cố phát sinh hàng tuần thay vì dồn tài liệu vào các tuần cuối.
4. **Tư duy Giải quyết Sự cố Linh hoạt:** Trong môi trường đám mây thực tế, khả năng tìm kiếm giải pháp thay thế (Workaround) khi gặp rào cản hạ tầng là kỹ năng sống còn.
5. **Chủ động Giải phóng Tài nguyên (Cleanup):** Luôn có ý thức dọn dẹp SageMaker Endpoints ngay sau khi hoàn tất thử nghiệm để tối ưu chi phí vận hành.

---

## 5. Kỹ năng Chuyên môn Áp dụng vào Sự nghiệp

| Kỹ năng Kỹ thuật | Ứng dụng Thực tế trong Công việc |
|------------------|----------------------------------|
| **AWS IAM Least Privilege** | Thiết kế phân quyền an toàn cho mọi hệ thống đám mây doanh nghiệp |
| **Thư viện Python `boto3` API** | Tự động hóa hạ tầng đám mây và quy trình xử lý dữ liệu tự động |
| **XGBoost & Feature Engineering** | Giải quyết các bài toán Machine Learning dạng bảng và chuỗi thời gian |
| **Deploy SageMaker Endpoints** | Triển khai mô hình AI/ML phục vụ ứng dụng sản xuất (Production) |
| **CloudWatch Monitoring & Drift** | Xây dựng hệ thống giám sát sức khỏe mô hình và phát hiện trôi dữ liệu |
| **MLOps & Automation Pipelines** | Tự động hóa quy trình CI/CD cho các dự án trí tuệ nhân tạo |

---

## 6. Lời kết

Chương trình AWS First Cloud AI Journey đã mang lại cho tôi trải nghiệm học tập và phát triển nghề nghiệp vô cùng ý nghĩa trong **8 tuần thực tập**. Bài học sâu sắc nhất mà tôi đúc kết được: **Một kỹ sư điện toán đám mây giỏi không phải là người không bao giờ gặp lỗi — mà là người thấu hiểu nguyên nhân cốt lõi và biết cách khắc phục sự cố một cách hệ thống, chuyên nghiệp.**

Xin chân thành cảm ơn Ban Tổ chức chương trình FCJ, Công ty AWS Viet Nam, cùng hai người bạn đồng hành tuyệt vời (Văn Thái Quân và Nguyễn Ngọc Sáng) đã cùng nhau tạo nên một kỳ thực tập thành công và đáng nhớ!

---

*Huỳnh Kim Quý | Data & ML Engineer Intern | AWS First Cloud AI Journey 2026*