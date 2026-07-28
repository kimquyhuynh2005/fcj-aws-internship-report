---
title: "Week 2 — Data Preprocessing & EDA"
date: 2026-06-13
weight: 2
chapter: false
pre: "<b>1.2. </b>"
---

## Week 2 — Data Preprocessing & EDA ✅

**Owner:** Huynh Kim Quy | **Period:** 13/06/2026 – 19/06/2026

---

### Context

Rossmann dataset has 1,017,209 records from 1,115 stores (2013–2015). Initial EDA revealed key patterns critical for feature engineering.

### Tasks Completed

1. **Exploratory Data Analysis**
   - Found **172,817 closed-store records** → removed from training data
   - Sales distribution is right-skewed → applied log-transform to target variable
   - December sales are consistently highest → strong seasonal pattern

2. **Key EDA Findings**

| Finding | Meaning |
|---------|---------|
| Sales is right-skewed | Apply log-transform to target |
| Promo increases Sales ~37% | Most important feature |
| December peak sales | Strong seasonality |
| 172,817 closed records | Remove when training |

3. **Feature Engineering**
   - Created rolling averages: `rolling_mean_7`, `rolling_mean_14`, `rolling_mean_30`
   - Created lag features: `lag_1`, `lag_7`, `lag_14`
   - Extracted date features: `DayOfWeek`, `Month`, `WeekOfYear`, `IsWeekend`
   - Total: **22 engineered features**

4. **Chronological Train/Val/Test Split**

| Split | Rows | Date Range |
|-------|------|-----------|
| Train | 785,727 | 2013-01-01 → 2015-05-31 |
| Validation | 28,423 | 2015-06-01 → 2015-06-30 |
| Test | 30,188 | 2015-07-01 → 2015-07-31 |

5. **Uploaded to S3**
   ```
   s3://aws-internship-hkq-2026/ml-forecasting/data/processed/
   ├── train.csv
   ├── val.csv
   ├── test.csv
   └── scaler.pkl
   ```

---

### Lessons Learned
- Fit StandardScaler **only on train set**, then transform val/test → no data leakage
- Dataset ends 2015-07-31 (not 2015-12-31 as initially planned) — always check data carefully before planning
- Right-skewed targets benefit from log-transform but require careful inverse-transform at inference time
