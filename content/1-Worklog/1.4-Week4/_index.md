---
title: "Tuần 4 — PyTorch LSTM & So sánh Đối chứng"
date: 2026-06-27
weight: 4
chapter: false
pre: "<b>1.4. </b>"
---

# Tuần 4 — Huấn luyện Mô hình Deep Learning PyTorch LSTM & So sánh Đối chứng

**Người thực hiện:** Huỳnh Kim Quý (Data & Machine Learning Engineer)  
**Thời gian:** 27/06/2026 – 03/07/2026  
**Mục tiêu chính:** Triển khai mô hình Học sâu (Deep Learning) chuỗi thời gian PyTorch LSTM, tiến hành huấn luyện thực nghiệm và xây dựng bảng đánh giá so sánh đối chứng trực diện với mô hình XGBoost.

---

## 1. Chi tiết Kiến trúc & Quy trình Huấn luyện PyTorch LSTM

### 1.1. Xây dựng Kiến trúc Mô hình Deep Learning (`model.py`)
Mô hình **SalesLSTM** được thiết kế dưới dạng mạng Nơ-ron Hồi quy 2 lớp (2-Layer Recurrent Neural Network) với các thông số cấu trúc:
- **Input Dimension:** 22 đặc trưng đầu vào (Features).
- **Hidden Dimension (`hidden_dim`):** 128 units (nút ẩn trong mỗi ô LSTM).
- **Number of Layers (`num_layers`):** 2 lớp LSTM xếp chồng (stacked LSTM).
- **Dropout Rate:** 0.2 (triệt tiêu 20% kết nối ngẫu nhiên để chống quá khớp).
- **Fully Connected Output Layer:** 1 Linear Unit nhận Hidden State của bước thời gian cuối cùng (`out[:, -1, :]`) để đưa ra giá trị doanh số dự báo.

### 1.2. Chuẩn hóa & Đóng gói Dữ liệu Chuỗi Thời gian (`dataset.py`)
- **Chuẩn hóa Dữ liệu:** Sử dụng `MinMaxScaler(feature_range=(0, 1))` cho toàn bộ 22 đặc trưng đầu vào nhằm đảm bảo độ dốc (gradient) không bị bùng nổ trong quá trình lan truyền ngược (backpropagation).
- **Sliding Window Sequences:** Tạo cửa sổ trượt độ dài 30 ngày (Sequence Length = 30) để mô hình học các chuỗi phụ thuộc ngắn và trung hạn.
- **PyTorch DataLoader:** Đóng gói tập dữ liệu thành `TensorDataset` và quản lý truy xuất theo lô (`batch_size=64`, `shuffle=False` để giữ nguyên thứ tự thời gian).

---

## 2. Bảng So sánh Kết quả Trực diện giữa XGBoost và PyTorch LSTM

Sau khi hoàn tất quá trình huấn luyện 50 Epochs trên máy chủ GPU, nhóm tiến hành đo đạc trực diện hiệu năng dự báo trên cùng tập dữ liệu kiểm thử độc lập (Test Set tháng 7/2015):

| Thuật toán Mô hình | Test RMSE | Test MAPE (%) | Thời gian Huấn luyện | Trạng thái & Quyết định |
|-------------------|-----------|---------------|----------------------|------------------------|
| **XGBoost Regressor (v1.7.6)** ⭐ | **925.28** | **9.92%** | **~45 giây (CPU)** | **✅ Chọn làm Production Model** |
| PyTorch LSTM (2-layer Stacked) | 3,044.43 | 32.79% | ~8 phút (GPU) | ❌ Thử nghiệm (Experiment Only) |

---

## 3. Phân tích Nguyên nhân Cốt lõi (Root Cause Analysis)

Mặc dù kiến trúc LSTM là công cụ mạnh mẽ trong xử lý dữ liệu chuỗi, kết quả thực nghiệm cho thấy XGBoost vượt trội hơn hẳn trên tập dữ liệu này vì 4 nguyên nhân kỹ thuật:

1. **Bản chất Dữ liệu dạng Bảng (Tabular Nature):** Dữ liệu Rossmann có tính chất bảng cao (nhiều đặc trưng rời rạc như `StoreType`, `Assortment`, `Promo`, `StateHoliday`). Các thuật toán cây quyết định như XGBoost xử lý các điểm cắt rời rạc này hiệu quả hơn nhiều so với hàm kích hoạt liên tục của LSTM.
2. **Độ nhạy Chuẩn hóa (Scaling Sensitivity):** LSTM cực kỳ nhạy cảm với biên độ dữ liệu. Việc chuẩn hóa `MinMaxScaler` trên tập dữ liệu có sự biến động doanh số cực lớn giữa các ngày lễ làm giảm khả năng học các đỉnh nhọn doanh số (Sales Spikes).
3. **Hiệu quả của Feature Engineering:** XGBoost tận dụng trực tiếp 22 đặc trưng được tính toán sẵn (Rolling Means, Lags), trong khi LSTM phải tự học các mối quan hệ thời gian từ chuỗi thô.
4. **Thời gian & Chi phí Tính toán:** XGBoost huấn luyện cực nhanh (~45 giây trên CPU) và dễ bảo trì hơn nhiều so với việc duy trì GPU cho LSTM.

---

## 4. Mã nguồn Kiến trúc PyTorch LSTM (`lstm_model.py`)

```python
import torch
import torch.nn as nn

class SalesLSTM(nn.Module):
    """Kiến trúc PyTorch 2-layer LSTM cho bài toán dự báo chuỗi thời gian doanh số."""
    def __init__(self, input_dim=22, hidden_dim=128, num_layers=2, output_dim=1):
        super(SalesLSTM, self).__init__()
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.2
        )
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        # x shape: (batch_size, seq_len, input_dim)
        out, _ = self.lstm(x)
        # Lấy vector đại diện tại timestep cuối cùng của sequence
        out = self.fc(out[:, -1, :])
        return out

# Kiểm thử shape
if __name__ == "__main__":
    model = SalesLSTM(input_dim=22)
    dummy_input = torch.randn(64, 30, 22) # Batch 64, Seq 30, Feats 22
    output = model(dummy_input)
    print(f"✅ Pass forward pass check! Output shape: {output.shape}") # Expect: (64, 1)
```

---

## 5. Kết luận & Quyết định Kiến trúc

> **Quyết định chốt:** Lựa chọn **XGBoost Regressor** làm mô hình chính thức (Production Model) cho hệ thống MLOps. Việc giữ mô hình LSTM kém hơn trong báo cáo được ghi nhận là một trải nghiệm thực nghiệm có giá trị, chứng minh tư duy lựa chọn công nghệ dựa trên bằng chứng dữ liệu thực tế (Data-driven Decision Making) thay vì chạy theo xu hướng Deep Learning.
