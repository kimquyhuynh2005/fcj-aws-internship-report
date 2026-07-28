---
title: "3. Xử lý dữ liệu"
date: 2026-06-06
weight: 3
chapter: false
pre: "<b>4.3. </b>"
---

## Bước 3: Tiền xử lý Dữ liệu & Biến đổi Đặc trưng (Feature Engineering)

### Tổng quan Dataset

```text
Rossmann Store Sales
├── train.csv    — 1,017,209 dòng × 9 cột
└── store.csv    — 1,115 dòng × 10 cột (thông tin thuộc tính cửa hàng)
```

**Các cột dữ liệu chính:**
- `Store` — ID cửa hàng (1–1115)
- `DayOfWeek` — Thứ trong tuần (1=Thứ Hai, 7=Chủ Nhật)
- `Date` — Ngày ghi nhận doanh số
- `Sales` — Doanh số bán hàng ngày (biến mục tiêu target)
- `Customers` — Số lượng khách hàng
- `Open` — Trạng thái mở/đóng cửa (0/1)
- `Promo` — Chương trình khuyến mãi (0/1)
- `StateHoliday` — Mã ngày lễ quốc gia
- `SchoolHoliday` — Cờ nghỉ lễ trường học

---

### Khởi chạy Script Tiền xử lý

```bash
python week2_preprocessing/preprocessing.py
```

---

### Các bước Tiền xử lý Kỹ thuật Chính

#### 1. Gộp Dataset & Làm sạch Dữ liệu
```python
import pandas as pd
import numpy as np

# Đọc dữ liệu thô
df_train = pd.read_csv('data/raw/train.csv')
df_store = pd.read_csv('data/raw/store.csv')

# Merge thông tin cửa hàng
df = pd.merge(df_train, df_store, on='Store', how='left')

# Lọc bỏ các bản ghi khi cửa hàng đóng cửa (Sales = 0 hoặc Open = 0)
df = df[(df['Open'] == 1) & (df['Sales'] > 0)].copy()

# Xử lý giá trị thiếu (Missing Values)
df['CompetitionDistance'].fillna(df['CompetitionDistance'].median(), inplace=True)
df['Promo2SinceWeek'].fillna(0, inplace=True)
df['Promo2SinceYear'].fillna(0, inplace=True)
df['PromoInterval'].fillna('None', inplace=True)
```

#### 2. Biến đổi Đặc trưng Thời gian (Date Features)
```python
df['Date'] = pd.to_datetime(df['Date'])
df['Year'] = df['Date'].dt.year
df['Month'] = df['Date'].dt.month
df['Day'] = df['Date'].dt.day
df['WeekOfYear'] = df['Date'].dt.isocalendar().week.astype(int)
df['DayOfYear'] = df['Date'].dt.dayofyear
df['IsWeekend'] = df['DayOfWeek'].isin([6, 7]).astype(int)
df['IsDecember'] = (df['Month'] == 12).astype(int)
```

#### 3. Tạo Đặc trưng Trễ & Trung bình Trượt (Lag & Rolling Features)
```python
# Sắp xếp dữ liệu theo cửa hàng và thời gian
df = df.sort_values(['Store', 'Date']).reset_index(drop=True)

# Tạo các lag feature
df['lag_1'] = df.groupby('Store')['Sales'].shift(1)
df['lag_7'] = df.groupby('Store')['Sales'].shift(7)
df['lag_14'] = df.groupby('Store')['Sales'].shift(14)

# Tạo các rolling mean feature
df['rolling_mean_7'] = df.groupby('Store')['Sales'].transform(lambda x: x.shift(1).rolling(7).mean())
df['rolling_mean_14'] = df.groupby('Store')['Sales'].transform(lambda x: x.shift(1).rolling(14).mean())
df['rolling_mean_30'] = df.groupby('Store')['Sales'].transform(lambda x: x.shift(1).rolling(30).mean())

# Xóa các dòng có giá trị NaN do lag
df = df.dropna().reset_index(drop=True)
```

---

### Phân chia Tập dữ liệu (Train / Val / Test Split)

Do bài toán mang tính chất chuỗi thời gian (Time Series), ta phân chia dữ liệu theo thứ tự mốc thời gian để tránh rò rỉ dữ liệu (Data Leakage):

```text
Dữ liệu đã lọc: 844,338 bản ghi
├── Tập Train : 785,887 bản ghi (01/01/2013 → 15/06/2015)
├── Tập Val   :  28,451 bản ghi (16/06/2015 → 05/07/2015)
└── Tập Test  :  30,000 bản ghi (06/07/2015 → 31/07/2015)
```

---

### Đưa Dữ liệu lên Amazon S3

```python
import boto3

s3 = boto3.client('s3', region_name='ap-southeast-1')
bucket_name = 'aws-internship-hkq-2026'

s3.upload_file('data/processed/train.csv', bucket_name, 'ml-forecasting/data/processed/train.csv')
s3.upload_file('data/processed/val.csv', bucket_name, 'ml-forecasting/data/processed/val.csv')
s3.upload_file('data/processed/test.csv', bucket_name, 'ml-forecasting/data/processed/test.csv')

print("✅ Đã tải dữ liệu tiền xử lý lên S3 thành công!")
```
