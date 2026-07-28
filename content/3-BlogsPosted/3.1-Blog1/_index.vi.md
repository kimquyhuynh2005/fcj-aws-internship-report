---
title: "Blog 1: XGBoost vs. PyTorch LSTM cho Dự báo Chuỗi thời gian"
date: 2026-06-06
weight: 1
chapter: false
pre: "<b>3.1. </b>"
---

# Blog 1: XGBoost vs. PyTorch LSTM cho Dự báo Doanh số Chuỗi Thời gian

> **Tác giả:** Huỳnh Kim Quý  
> **Chuyên mục:** Machine Learning Engineering / Time Series Forecasting  
> **Đăng tại:** Cộng đồng AWS Study Group  
> **Dự án:** E-commerce Sales Forecasting on AWS SageMaker

---

## 📌 1. Đặt vấn đề: Định kiến "Deep Learning luôn áp đảo"

Trong cộng đồng Machine Learning & Data Science, có một định kiến rất phổ biến: **"Bất kỳ bài toán chuỗi thời gian (Time Series) nào cũng nên sử dụng các mô hình Deep Learning như LSTM, GRU hoặc Transformer để đạt độ chính xác cao nhất."**

Tuy nhiên, khi trực tiếp xây dựng hệ thống **Dự báo Doanh số Bán lẻ Rossmann** (bộ dữ liệu gồm **1,017,209 bản ghi** từ **1,115 cửa hàng**), nhóm chúng tôi đã thu được một kết quả thực nghiệm hoàn toàn trái ngược: **Mô hình XGBoost truyền thống đè bẹp PyTorch LSTM với độ chính xác cao gấp 3 lần và thời gian huấn luyện nhanh hơn 10 lần.**

Bài viết này sẽ đi sâu phân tích số liệu thực nghiệm và giải mã 4 lý do kỹ thuật đằng sau hiện tượng này.

---

## 📊 2. Bảng Kết quả So sánh Thực nghiệm

Nhóm chúng tôi xây dựng thử nghiệm song song trên cùng tập dữ liệu Train/Validation/Test được phân chia theo mốc thời gian thực tế (không leak dữ liệu tương lai):

| Tiêu chí So sánh | XGBoost Regressor (Baseline) ⭐ | PyTorch LSTM (Deep Learning) | Chênh lệch |
|---|---|---|---|
| **Test RMSE (Thấp hơn là tốt)** | **925.28** | **3,044.43** | XGBoost tốt hơn **3.29 lần** |
| **Test MAPE (Thấp hơn là tốt)** | **9.92%** | **32.79%** | XGBoost tốt hơn **3.30 lần** |
| **Thời gian huấn luyện (CPU)** | **~45 giây** | **~8 phút** (50 epochs) | XGBoost nhanh hơn **10.6 lần** |
| **Dung lượng Artifact Mô hình** | **~1.2 MB** | **~4.8 MB** | XGBoost nhẹ hơn **4 lần** |
| **Độ trễ Dự báo (Inference)** | **~12 ms** | **~85 ms** | XGBoost phản hồi nhanh hơn |
| **Trạng thái Triển khai AWS** | ✅ **Chọn làm Production Model** | ❌ Mô hình thử nghiệm | — |

---

## 🔍 3. Giải mã 4 Lý do Kỹ thuật XGBoost Chiến thắng

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   TẠI SAO XGBOOST LẠI THẮNG LSTM?                      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Bản chất Tabular Data: Cấu trúc phân nhánh cây tốt hơn liên kết chuỗi│
│ 2. Feature Engineering: 22 Lag/Rolling features đã gói gọn chuỗi gian   │
│ 3. Khả năng chống nhiễu: Bất biến với phép biến đổi đơn điệu & scale   │
│ 4. Hiệu năng tính toán: Thuật toán Cây tính nhanh hơn Ma trận RNN      │
└────────────────────────────────────────────────────────────────────────┘
```

### 🔹 Lý do 1: Bản chất dữ liệu dạng bảng (Tabular Data Structure)
Dữ liệu doanh số bán lẻ Rossmann không chỉ là một chuỗi số đơn thuần, mà là **dữ liệu dạng bảng nhiều chiều (Tabular Data)** kết hợp giữa:
- **Biến phân loại (Categorical):** `StoreType` (loại cửa hàng A/B/C/D), `Assortment` (cơ cấu hàng hóa), `StateHoliday`, `Promo2`.
- **Biến sự kiện (Binary Flags):** `Promo` (khuyến mãi), `SchoolHoliday`.
- **Biến liên tục (Continuous):** `CompetitionDistance` (khoảng cách đối thủ).

Các mô hình Dựa trên Cây (Tree-based Models) như XGBoost cắt ngưỡng không gian đặc trưng (Feature Space Partitioning) cực kỳ hiệu quả trên dữ liệu hỗn hợp này. Trong khi đó, LSTM liên tục ép các biến phân loại đi qua các hàm kích hoạt (Activation Functions như Tanh/Sigmoid), làm giảm khả năng phân tách ranh giới dữ liệu.

---

### 🔹 Lý do 2: Sức mạnh của Feature Engineering (Lag & Rolling Features)
Thay vì bắt mô hình tự học lại quy luật chuỗi thời gian từ đầu, chúng tôi đã chủ động thiết kế **22 đặc trưng kỹ thuật**, tiêu biểu là:
- **Trung bình trượt (Rolling Means):** `rolling_mean_7`, `rolling_mean_14`, `rolling_mean_30` (doanh số trung bình 7, 14, 30 ngày gần nhất).
- **Độ lệch quá khứ (Lag Features):** `lag_1`, `lag_7` (doanh số ngày hôm qua, doanh số cùng ngày tuần trước).
- **Tính mùa vụ (Calendar Features):** `DayOfWeek`, `Month`, `WeekOfYear`, `IsWeekend`, `IsDecember`.

Việc tạo ra các đặc trưng này đã **chuyển biến bài toán Chuỗi Thời gian (Time Series) phức tạp thành bài toán Học có giám sát (Supervised Regression)**. Tại điểm này, thuật toán Gradient Boosting của XGBoost phát huy tối đa sức mạnh phân nhánh cây trên các biến trung bình trượt.

---

### 🔹 Lý do 3: Độ nhạy với Scale & Dữ liệu bất thường (Outliers)
- **LSTM:** Rất nhạy cảm với thang đo dữ liệu (Data Scaling). Nếu doanh số tăng vọt vào dịp Giáng sinh (tháng 12), gradient của LSTM dễ bị bùng nổ hoặc mất mát (Exploding/Vanishing Gradients).
- **XGBoost:** Bất biến với các phép biến đổi đơn điệu (Monotonic Transformations) và cực kỳ bền bỉ trước các điểm dữ liệu nhiễu/bất thường nhờ cơ chế chia nhánh theo vị trí xếp hạng (Rank-based Splitting).

---

### 🔹 Lý do 4: Hiệu năng tính toán & Tối ưu hóa Tài nguyên Cloud
- Huấn luyện XGBoost với `tree_method='hist'` chỉ mất **45 giây** trên 1 CPU instance thường (`ml.t3.medium`).
- Huấn luyện LSTM 2 lớp mất tới **8 phút** trên CPU mà vẫn chưa đạt điểm hội tụ tối ưu (loss vẫn giảm ở epoch 50).
- Trên môi trường Cloud AWS, việc chọn XGBoost giúp **tiết kiệm hơn 90% chi phí máy chủ huấn luyện (Training Instance Costs)**.

---

## 💡 4. Phân tích SHAP Value & Bài học Kỹ sư ML

Để minh chứng tính giải thích được (Explainability) của mô hình XGBoost, chúng tôi sử dụng thư viện **SHAP (SHapley Additive exPlanations)** để phân tích tầm quan trọng của các đặc trưng:

```python
import shap
import pickle

with open('models/xgboost_model.pkl', 'rb') as f:
    model = pickle.load(f)

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test.sample(1000))
```

**Kết quả xếp hạng đặc trưng quyết định nhất:**
1. **`rolling_mean_14` (Tầm ảnh hưởng lớn nhất):** Trung bình doanh số 14 ngày gần nhất là chỉ báo dự báo chính xác nhất xu hướng ngắn hạn.
2. **`Promo` (Tầm ảnh hưởng thứ 2):** Khuyến mãi làm tăng trung bình **~37% doanh số** của cửa hàng.
3. **`rolling_mean_30` & `DayOfWeek`:** Quyết định mức doanh số cơ sở và chu kỳ mua sắm cuối tuần.

---

## 🏁 5. Kết luận & Lời khuyên cho Thực tập sinh

1. **Đừng coi thường Baseline đơn giản:** Trước khi nhảy vào xây dựng các mạng Nơ-ron sâu phức tạp, hãy luôn bắt đầu bằng một mô hình Gradient Boosting (XGBoost / LightGBM) được feature engineering kỹ càng.
2. **Tabular Data là vương quốc của Cây Quyết định:** Với các bài toán dữ liệu dạng bảng dưới vài triệu bản ghi, các mô hình dạng Cây vẫn đang và sẽ tiếp tục là sự lựa chọn tối ưu số 1 về cả độ chính xác lẫn chi phí vận hành.
3. **Tư duy hướng Sản phẩm (Production-First Mindset):** Mô hình tốt nhất không phải mô hình phức tạp nhất, mà là mô hình đạt **độ chính xác cao nhất với chi phí tính toán và độ trễ phục vụ (Inference Latency) thấp nhất**.

---

*Bài viết thuộc chuỗi báo cáo chuyên môn của dự án **E-commerce Sales Forecasting on AWS SageMaker** — Chương trình AWS First Cloud AI Journey.*
