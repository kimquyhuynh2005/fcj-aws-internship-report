# Blog 1: XGBoost vs. PyTorch LSTM trong Dự báo Chuỗi thời gian

> **Tác giả:** Huỳnh Kim Quý  
> **Chuyên mục:** Machine Learning Engineering / Time Series Forecasting  
> **Cộng đồng:** AWS Study Group  
> **Dự án:** E-commerce Sales Forecasting on AWS SageMaker  

---

## 1. Đặt vấn đề và định kiến phổ biến

Trong lĩnh vực Machine Learning và Data Science, một quan điểm phổ biến thường được đưa ra là các bài toán chuỗi thời gian (Time Series) luôn yêu cầu sử dụng các mô hình Deep Learning như LSTM, GRU hoặc Transformer để đạt hiệu năng tối ưu.

Tuy nhiên, trong quá trình xây dựng hệ thống dự báo doanh số bán lẻ Rossmann (bộ dữ liệu gồm 1,017,209 bản ghi từ 1,115 cửa hàng), thực nghiệm thực tế cho thấy mô hình XGBoost dựa trên cây quyết định (Tree-based model) đạt độ chính xác vượt trội so với kiến trúc PyTorch LSTM, đồng thời tối ưu hóa đáng kể thời gian huấn luyện và tài nguyên tính toán.

Bài viết này phân tích số liệu thực nghiệm và giải trình các nguyên nhân kỹ thuật đằng sau kết quả trên.

---

## 2. Kết quả so sánh thực nghiệm

Thử nghiệm được thực hiện trên cùng một tập dữ liệu Train, Validation và Test được phân chia theo thứ tự thời gian để đảm bảo tính khách quan và tránh rò rỉ dữ liệu (Data Leakage).

| Tiêu chí đánh giá | XGBoost Regressor (Baseline) | PyTorch LSTM (Deep Learning) | Mức độ chênh lệch |
|---|---|---|---|
| Test RMSE (Thấp hơn là tốt) | **925.28** | 3,044.43 | XGBoost tốt hơn 3.29 lần |
| Test MAPE (Thấp hơn là tốt) | **9.92%** | 32.79% | XGBoost tốt hơn 3.30 lần |
| Thời gian huấn luyện (CPU) | **~45 giây** | ~8 phút (50 epochs) | XGBoost nhanh hơn 10.6 lần |
| Dung lượng mô hình (Artifact) | **~1.2 MB** | ~4.8 MB | XGBoost nhẹ hơn 4.0 lần |
| Độ trễ dự báo (Inference Latency) | **~12 ms** | ~85 ms | XGBoost phản hồi nhanh hơn |
| Trạng thái triển khai AWS | **Chọn làm Production Model** | Mô hình thử nghiệm | — |

![Biểu đồ so sánh hiệu năng RMSE và MAPE giữa XGBoost và PyTorch LSTM](/images/3-BlogsPosted/model_comparison.png)

---

## 3. Phân tích nguyên nhân kỹ thuật

### 3.1. Đặc điểm cấu trúc dữ liệu dạng bảng (Tabular Data)
Bộ dữ liệu Rossmann là dữ liệu dạng bảng nhiều chiều kết hợp giữa các biến phân loại (`StoreType`, `Assortment`, `StateHoliday`), biến cờ sự kiện (`Promo`, `SchoolHoliday`) và các biến liên tục (`CompetitionDistance`).

Các thuật toán dựa trên cây quyết định như XGBoost thực hiện phân nhánh không gian đặc trưng (Feature Space Partitioning) hiệu quả hơn trên dữ liệu hỗn hợp này. Ngược lại, mạng LSTM xử lý dữ liệu bằng cách liên tục truyền trạng thái qua các hàm kích hoạt phi tuyến (Tanh/Sigmoid), làm giảm khả năng phân tách ranh giới dữ liệu phân loại.

### 3.2. Vai trò của việc xây dựng đặc trưng (Feature Engineering)
Thay vì phụ thuộc vào khả năng tự học chuỗi của mạng nơ-ron, hệ thống được bổ sung 22 đặc trưng kỹ thuật:
- **Trung bình trượt (Rolling Means):** `rolling_mean_7`, `rolling_mean_14`, `rolling_mean_30`.
- **Độ trễ thời gian (Lag Features):** `lag_1`, `lag_7`, `lag_14`.
- **Tính mùa vụ (Calendar Features):** `DayOfWeek`, `Month`, `WeekOfYear`, `IsWeekend`, `IsDecember`.

Các đặc trưng này chuyển đổi bài toán chuỗi thời gian thành bài toán Hồi quy có giám sát (Supervised Regression). Thuật toán Gradient Boosting của XGBoost khai thác tối đa các chỉ số trung bình trượt này để đưa ra dự báo.

### 3.3. Độ bền vững trước biến động dữ liệu và thang đo (Scale Robustness)
Mạng LSTM nhạy cảm với thang đo của dữ liệu đầu vào. Khi doanh số tăng đột biến vào các giai đoạn cao điểm (như tháng 12), gradient của LSTM dễ bị rơi vào trạng thái bùng nổ hoặc biến mất (Exploding/Vanishing Gradients). 

XGBoost có tính chất bất biến với các phép biến đổi đơn điệu (Monotonic Transformations) và không bị ảnh hưởng bởi thang đo dữ liệu nhờ cơ chế phân nhánh dựa trên thứ hạng (Rank-based Splitting).

### 3.4. Hiệu năng tính toán và chi phí hạ tầng AWS
Huấn luyện XGBoost với phương pháp `tree_method='hist'` hoàn tất trong 45 giây trên một instance CPU tiêu chuẩn (`ml.t3.medium`). Trong khi đó, mạng LSTM 2 lớp mất 8 phút nhưng chưa đạt trạng thái hội tụ tối ưu. Trên môi trường cloud, việc sử dụng XGBoost giúp giảm hơn 90% chi phí máy chủ huấn luyện.

---

## 4. Phân tích tầm quan trọng đặc trưng bằng SHAP Values

Sử dụng thư viện SHAP (SHapley Additive exPlanations) để đánh giá mức độ đóng góp của từng đặc trưng vào kết quả dự báo của mô hình XGBoost:

```python
import shap
import pickle

with open('models/xgboost_model.pkl', 'rb') as f:
    model = pickle.load(f)

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test.sample(1000, random_state=42))
```

![Biểu đồ phân tích SHAP Summary Plot đánh giá tác động của từng đặc trưng tới doanh số](/images/3-BlogsPosted/shap_summary.png)

![Xếp hạng tầm quan trọng đặc trưng SHAP Feature Importance](/images/3-BlogsPosted/shap_importance.png)

Xếp hạng các đặc trưng có ảnh hưởng lớn nhất:
1. `rolling_mean_14`: Trung bình doanh số 14 ngày gần nhất đóng vai trò là chỉ báo ngắn hạn quan trọng nhất.
2. `Promo`: Chương trình khuyến mại làm tăng trung bình 37% doanh số của cửa hàng.
3. `rolling_mean_30` và `DayOfWeek`: Xác định mức doanh số nền tảng và chu kỳ tiêu dùng theo tuần.

---

## 5. Kết luận

1. **Đánh giá mô hình baseline:** Cần thiết lập mô hình baseline từ Gradient Boosting (XGBoost/LightGBM) kết hợp Feature Engineering trước khi thử nghiệm các kiến trúc mạng nơ-ron phức tạp.
2. **Ưu thế của Tree-based Models trên Tabular Data:** Đối với dữ liệu dạng bảng dưới vài triệu bản ghi, các mô hình dựa trên cây vẫn duy trì hiệu năng vượt trội về độ chính xác và tốc độ xử lý.
3. **Tiêu chuẩn lựa chọn mô hình Production:** Mô hình được chọn cần tối ưu hóa đồng thời giữa độ chính xác, chi phí hạ tầng và độ trễ phản hồi trong môi trường thực tế.
