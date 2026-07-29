---
title: "Blog 2: Theo dõi Thí nghiệm Machine Learning với Amazon SageMaker Experiments"
date: 2026-06-06
weight: 2
chapter: false
pre: "<b>3.2. </b>"
---

> **Tác giả:** Huỳnh Kim Quý  
> **Chuyên mục:** Machine Learning Engineering / Experiment Tracking  
> **Cộng đồng:** AWS Study Group  
> **Dự án:** E-commerce Sales Forecasting on AWS SageMaker  

---

## Theo dõi Thí nghiệm Machine Learning với Amazon SageMaker Experiments

Trong quá trình xây dựng một dự án dự báo doanh số bán hàng trên AWS, mình nhận ra rằng việc huấn luyện mô hình chỉ là một phần nhỏ của công việc. Phần tốn thời gian hơn, và cũng dễ bị bỏ qua hơn, là quản lý các lần thử nghiệm: mình đã thử những tham số nào, kết quả ra sao, và lần chạy nào cho ra mô hình tốt nhất. Khi số lần thử tăng lên, chỉ dựa vào file log hay notebook thôi là không đủ.

Amazon SageMaker Experiments là dịch vụ mình tìm đến để giải quyết vấn đề này. Điều thú vị là mình không cần phải train mô hình trên SageMaker mới dùng được tính năng này. Toàn bộ quá trình tracking có thể được tích hợp vào script Python chạy trên máy local thông qua boto3, điều mà khá nhiều tài liệu không nói rõ.

---

## 1. Bối cảnh: Vấn đề của việc quản lý thử nghiệm thủ công

Khi mình bắt đầu chạy các experiment đầu tiên với XGBoost, mọi thứ vẫn còn đơn giản. Mình ghi kết quả vào một file CSV, mỗi dòng là một lần chạy với các tham số và chỉ số tương ứng. Cách này ổn cho đến khi số lần chạy vượt qua vài chục và mình bắt đầu cần so sánh nhiều chiều cùng lúc: không chỉ RMSE mà còn MAPE, thời gian train, số feature được dùng, và nhiều thứ khác.

Vấn đề của file CSV là mình phải tự duy trì cấu trúc, tự viết code để visualize, và rất dễ ghi nhầm hoặc ghi thiếu. Quan trọng hơn, khi muốn chia sẻ kết quả với người khác trong nhóm, mình phải gửi file, giải thích cấu trúc, rồi đối phương phải tự chạy lại để xem biểu đồ. Không có một giao diện chung nào để cả nhóm nhìn vào cùng lúc.

---

## 2. Amazon SageMaker Experiments là gì

SageMaker Experiments là một dịch vụ cho phép tổ chức, theo dõi và so sánh các lần chạy thí nghiệm Machine Learning. Về cơ bản, nó cung cấp một cấu trúc phân cấp gồm Experiment (thí nghiệm tổng thể), Run (mỗi lần chạy cụ thể), và Metric (các chỉ số được ghi lại trong mỗi lần chạy).

Điều mình thấy hữu ích nhất là sau khi ghi dữ liệu vào SageMaker Experiments, mình có thể vào giao diện AWS Console, chọn thẳng các cột muốn so sánh, lọc theo điều kiện, và xem biểu đồ mà không cần viết thêm một dòng code nào. Đây là thứ mà tự xây dựng bằng file CSV sẽ mất khá nhiều công.

---

## 3. Cách tích hợp với Script Train Local

Vì mình train mô hình trên máy cá nhân thay vì dùng SageMaker Training Jobs, cách tích hợp mình dùng là gọi thẳng API của boto3 từ trong script Python.

Trước tiên mình tạo một Experiment để nhóm tất cả các lần chạy liên quan lại với nhau. Sau đó với mỗi lần train, mình tạo một Run mới và ghi các tham số đầu vào (như learning rate, max depth, số estimators) cùng các chỉ số đầu ra (RMSE và MAPE trên tập validation và test). Toàn bộ việc này chỉ cần vài dòng boto3 và có thể đặt ngay trong vòng lặp train mà không làm thay đổi logic chính của script.

Một điểm cần chú ý là mình cần đảm bảo thông tin xác thực AWS đã được cấu hình trên máy local, và IAM user hoặc role sử dụng phải có quyền `sagemaker:CreateExperiment`, `sagemaker:CreateRun` và `sagemaker:BatchPutMetrics`. Nếu thiếu bất kỳ quyền nào trong số này, lệnh sẽ trả về lỗi `AccessDeniedException` mà đôi khi message lỗi không đủ rõ để biết ngay đó là vấn đề permission.

---

## 4. So sánh các lần chạy trên giao diện

Sau khi đã có dữ liệu từ nhiều lần chạy, giao diện SageMaker Experiments cho phép mình chọn nhiều Run cùng lúc và xem bảng so sánh song song. Mình có thể thấy ngay lần nào cho RMSE thấp nhất, lần nào dùng learning rate cao hơn lại cho kết quả tệ hơn, hay tham số nào có vẻ ít ảnh hưởng đến kết quả.

Ngoài bảng so sánh, giao diện còn có phần biểu đồ để vẽ các metric theo từng step. Với XGBoost, mình ghi RMSE theo từng boosting round nên có thể thấy rõ đường cong học tập của mô hình, nhận ra điểm nào bắt đầu overfit và đánh giá xem early stopping có hoạt động đúng không. Những thứ này trước đây mình phải tự vẽ bằng matplotlib sau khi train xong.

---

## 5. Những điểm đáng lưu ý

- **Tính duy nhất của Tên Experiment:** Tên Experiment phải là duy nhất trong cùng một region và account. Nếu mình gọi `create_experiment` với tên đã tồn tại, API sẽ báo lỗi. Cách xử lý đơn giản là dùng `try/except` để bắt lỗi `ResourceInUse` và tiếp tục dùng experiment đó, hoặc thêm timestamp vào tên để đảm bảo luôn tạo mới.
- **Lưu trữ dữ liệu lâu dài:** Dữ liệu ghi vào SageMaker Experiments không bị xóa tự động. Đây vừa là lợi thế (lịch sử được lưu lại lâu dài) vừa là thứ cần chú ý nếu bạn chạy rất nhiều experiment và không muốn dữ liệu cũ làm rối giao diện. SageMaker có API để xóa Run và Experiment khi không còn cần thiết.
- **Tối ưu Chi phí:** Về chi phí, SageMaker Experiments tính theo số metric được ghi. Với các dự án quy mô nhỏ đến vừa, khoản chi phí này thường không đáng kể. Tuy nhiên nếu bạn ghi rất nhiều metric cho rất nhiều Run, nên xem lại pricing page để ước tính trước.

---

## 6. Kết luận

Việc dùng Amazon SageMaker Experiments không đòi hỏi phải thay đổi cách train mô hình hay chuyển hạ tầng lên cloud. Chỉ cần thêm vài lệnh boto3 vào script hiện có, mình đã có ngay một hệ thống tracking có giao diện trực quan, lưu trữ trung tâm và có thể chia sẻ với cả nhóm mà không cần duy trì bất kỳ file nào thêm. Với những dự án có nhiều lần thử nghiệm tham số, đây là một công cụ đáng để thêm vào quy trình làm việc.

---

### Tài liệu tham khảo
- [AWS Documentation – Amazon SageMaker Experiments](https://docs.aws.amazon.com/sagemaker/latest/dg/experiments.html)
- [AWS Documentation – SageMaker Python SDK Experiments](https://sagemaker-experiments.readthedocs.io/)
