---
title: "Data Preprocessing & Amazon S3 Integration"
date: 2026-06-06
weight: 3
chapter: false
pre: "<b>5.3. </b>"
---

## Step 3: Data Preprocessing & Feature Engineering

### Dataset Overview

```
Rossmann Store Sales
├── train.csv    — 1,017,209 rows × 9 columns
└── store.csv    — 1,115 rows × 10 columns (store metadata)
```

**Key columns:**
- `Store` — store ID (1–1115)
- `DayOfWeek` — 1=Monday, 7=Sunday
- `Date` — sale date
- `Sales` — daily sales (target)
- `Customers` — number of customers
- `Open` — 0/1 (store open or closed)
- `Promo` — 0/1 (promotion active)
- `StateHoliday` — public holiday code
- `SchoolHoliday` — school holiday flag

### Run Preprocessing

```bash
python week2_preprocessing/preprocessing.py
```

### Key Preprocessing Steps

#### 1. Merge Datasets
```python
import pandas as pd

train = pd.read_csv('data/raw/train.csv', parse_dates=['Date'])
store = pd.read_csv('data/raw/store.csv')
df = train.merge(store, on='Store', how='left')
```

#### 2. Remove Closed Store Days
```python
# Remove 172,817 records where store was closed
df = df[df['Open'] == 1].copy()
# Remove rows where Sales = 0 (no sales on open days → anomaly)
df = df[df['Sales'] > 0].copy()
print(f"After filter: {len(df):,} rows")
# Output: 844,338 rows
```

#### 3. Feature Engineering (22 features)
```python
# Date features
df['Year'] = df['Date'].dt.year
df['Month'] = df['Date'].dt.month
df['Day'] = df['Date'].dt.day
df['WeekOfYear'] = df['Date'].dt.isocalendar().week.astype(int)
df['DayOfYear'] = df['Date'].dt.dayofyear
df['IsWeekend'] = (df['DayOfWeek'] >= 6).astype(int)
df['IsDecember'] = (df['Month'] == 12).astype(int)

# Sort by store and date for time-based features
df = df.sort_values(['Store', 'Date']).reset_index(drop=True)

# Rolling averages (per store)
for window in [7, 14, 30]:
    df[f'rolling_mean_{window}'] = df.groupby('Store')['Sales'] \
        .transform(lambda x: x.shift(1).rolling(window, min_periods=1).mean())

# Lag features
for lag in [1, 7, 14]:
    df[f'lag_{lag}'] = df.groupby('Store')['Sales'].transform(lambda x: x.shift(lag))
```

#### 4. Chronological Train/Val/Test Split

{{% notice warning %}}
**Critical:** Always split time series data chronologically — never random split! Random splitting causes data leakage from future to past.
{{% /notice %}}

```python
train_data = df[df['Date'] < '2015-06-01']
val_data   = df[(df['Date'] >= '2015-06-01') & (df['Date'] < '2015-07-01')]
test_data  = df[df['Date'] >= '2015-07-01']

print(f"Train: {len(train_data):,} rows")   # 785,727
print(f"Val:   {len(val_data):,} rows")     # 28,423
print(f"Test:  {len(test_data):,} rows")    # 30,188
```

#### 5. Upload to S3

```python
import boto3

s3 = boto3.client('s3', region_name='ap-southeast-1')

for name, data in [('train', train_data), ('val', val_data), ('test', test_data)]:
    local_path = f'data/processed/{name}.csv'
    data.to_csv(local_path, index=False)
    s3.upload_file(local_path, BUCKET_NAME, f'{PREFIX}/data/processed/{name}.csv')
    print(f"Uploaded {name}.csv ✅")
```

### EDA Key Findings

```
📊 Sales Distribution:
   - Right-skewed (mean > median)
   - Peak in December (Christmas shopping)
   - Promo increases average Sales by ~37%

📊 Closed Store Days:
   - 172,817 records where Open=0 (removed)
   - Store type 'b' has many closures

📊 Missing Values:
   - CompetitionDistance: 2,642 nulls → filled with median
   - PromoInterval: many nulls → encoded as 0
```

### Expected Output

```
s3://your-bucket/ml-forecasting/data/processed/
├── train.csv    (785,727 rows, 22 features + target)
├── val.csv      (28,423 rows)
└── test.csv     (30,188 rows)
```