# Blog 2: Theo dõi Thí nghiệm Machine Learning với Amazon SageMaker Experiments

> **Tác giả:** Nguyễn Ngọc Sáng  
> **Chuyên mục:** Machine Learning Engineering / Experiment Tracking  
> **Cộng đồng:** AWS Study Group  
> **Dự án:** E-commerce Sales Forecasting on AWS SageMaker  

---

## Theo dõi Thí nghiệm Machine Learning với Amazon SageMaker Experiments

Trong quá trình xây dựng hệ thống dự báo doanh số bán hàng trên hạ tầng AWS, bên cạnh công đoạn huấn luyện mô hình, công tác quản lý và ghi vết các lượt thí nghiệm (Experiment Tracking) đóng vai trò then chốt. Việc ghi nhận chính xác các siêu tham số (hyperparameters), chỉ số đánh giá và xác định phiên bản mô hình tối ưu là yêu cầu bắt buộc nhằm đảm bảo tính tái lập (reproducibility) trong kỹ thuật Machine Learning.

Amazon SageMaker Experiments là giải pháp điện toán đám mây chuyên dụng đáp ứng các yêu cầu trên. Điểm đặc trưng của dịch vụ này là khả năng tích hợp linh hoạt thông qua API `boto3` trong môi trường mã nguồn Python cục bộ (local environment) mà không bắt buộc phải thực thi toàn bộ tiến trình huấn luyện trên máy chủ SageMaker.

---

## 1. Bối cảnh và thách thức khi quản lý thí nghiệm thủ công

Trong giai đoạn đầu của dự án, công tác quản lý các lần chạy thử nghiệm với mô hình XGBoost thường được thực hiện thủ công bằng cách lưu trữ tham số và chỉ số đánh giá vào các tập tin định dạng CSV. Tuy nhiên, khi số lượng thí nghiệm gia tăng đến hàng chục phiên bản, phương pháp này bộc lộ nhiều hạn chế:

- **Khó khăn trong so sánh đa chiều:** Việc so sánh đồng thời nhiều chỉ số kỹ thuật (như RMSE, MAPE, thời gian huấn luyện, số lượng đặc trưng) đòi hỏi nhiều thao tác truy xuất thủ công.
- **Tính toàn vẹn dữ liệu kém:** Việc lưu trữ dạng tập tin tĩnh dễ dẫn đến tình trạng sai lệch hoặc thiếu sót dữ liệu thí nghiệm.
- **Hạn chế trong làm việc nhóm:** Thiếu giao diện quản lý tập trung gây khó khăn cho việc chia sẻ, đối chiếu kết quả giữa các thành viên trong dự án.

---

## 2. Kiến trúc của Amazon SageMaker Experiments

SageMaker Experiments cung cấp một mô hình phân cấp quản lý thí nghiệm khoa học bao gồm 3 thành phần chính:
- **Experiment (Thí nghiệm tổng thể):** Cấu trúc cấp cao nhất dùng để quản lý toàn bộ các lượt chạy thuộc cùng một mục tiêu nghiên cứu.
- **Run (Lượt chạy cụ thể):** Đại diện cho một phiên bản huấn luyện mô hình thực tế.
- **Metric (Chỉ số đo lường):** Các thông số đầu vào và chỉ số hiệu năng đầu ra được ghi vết tự động.

Nhờ cấu trúc này, các nhà phát triển có thể truy cập giao diện AWS Management Console để truy vấn, lọc dữ liệu và trực quan hóa kết quả so sánh giữa các phiên bản mô hình một cách tự động.

---

## 3. Quy trình tích hợp với kịch bản huấn luyện cục bộ (Local Training Script)

Trong dự án, tiến trình huấn luyện được thực thi trên môi trường máy chủ cục bộ và kết nối với dịch vụ đám mây thông qua thư viện AWS SDK (`boto3`):

1. **Khởi tạo Experiment:** Thiết lập đối tượng Experiment để nhóm toàn bộ các lượt chạy thử nghiệm liên quan.
2. **Khởi tạo Run:** Tại mỗi chu kỳ huấn luyện, một đối tượng Run mới được khởi tạo để ghi nhận các tham số cấu hình (như `learning_rate`, `max_depth`, `n_estimators`) và các chỉ số đo lường (`RMSE`, `MAPE`).
3. **Phân quyền IAM:** Tiến trình ghi dữ liệu yêu cầu các quyền truy cập IAM tối thiểu bao gồm: `sagemaker:CreateExperiment`, `sagemaker:CreateRun` và `sagemaker:BatchPutMetrics`.

---

## 4. Trực quan hóa và so sánh hiệu năng

Giao diện quản trị SageMaker Experiments hỗ trợ so sánh song song nhiều phiên bản Run:
- **So sánh chỉ số đa chiều:** Giúp nhanh chóng xác định tập tham số mang lại chỉ số RMSE/MAPE tối ưu nhất.
- **Phân tích đường cong học tập (Learning Curves):** Đối với mô hình XGBoost, chỉ số RMSE được ghi nhận theo từng vòng lặp (boosting round), hỗ trợ phát hiện hiện tượng quá khớp (overfitting) và kiểm tra hiệu quả của cơ chế ngắt sớm (early stopping).

---

## 5. Các lưu ý kỹ thuật khi triển khai

- **Tính duy nhất của tên Thí nghiệm:** Tên của đối tượng Experiment là duy nhất trong cùng một tài khoản và vùng AWS Region. Cần xử lý ngoại lệ `ResourceInUse` để tái sử dụng đối tượng Experiment đã tồn tại.
- **Quản lý vòng đời dữ liệu:** Dữ liệu thí nghiệm được lưu trữ lâu dài trên đám mây. Cần chủ động dọn dẹp các lượt chạy không còn sử dụng thông qua API để tối ưu không gian quản lý.
- **Tối ưu chi phí:** Chi phí dịch vụ được tính dựa trên lượng chỉ số (metrics) được ghi nhận. Việc thiết lập tần suất ghi hợp lý giúp kiểm soát hiệu quả chi phí vận hành.

---

## 6. Kết luận

Amazon SageMaker Experiments cung cấp giải pháp quản lý thí nghiệm Machine Learning chuẩn mực, cho phép tích hợp trực tiếp vào quy trình làm việc hiện có mà không đòi hỏi thay đổi cấu trúc hạ tầng. Giải pháp này nâng cao tính minh bạch, khả năng tái lập và hiệu quả hợp tác trong các dự án phát triển mô hình trí tuệ nhân tạo.

---

### Tài liệu tham khảo
- [AWS Documentation – Amazon SageMaker Experiments](https://docs.aws.amazon.com/sagemaker/latest/dg/experiments.html)
- [AWS Documentation – SageMaker Python SDK Experiments](https://sagemaker-experiments.readthedocs.io/)