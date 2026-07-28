---
title: "Week 7 — Monitoring + Drift Detection"
date: 2026-07-18
weight: 7
chapter: false
pre: "<b>1.7. </b>"
---

## Week 7 — Monitoring + Drift Detection ✅

**Owner:** Nguyen Ngoc Sang | **Period:** 18/07/2026 – 24/07/2026

---

### Context
Model XGBoost deployed in Week 6. Rossmann dataset ends in 2015 — no real new data available for monitoring. Solution: wrote `drift_simulator.py` to synthetically generate anomalous data for testing the monitoring system.

### Tasks Completed

1. **Created Baseline Statistics from Training Data**
   - Read `week2_preprocessing/data/processed/train.csv`
   - Computed mean, std, min, max, count for 5 top features (by SHAP): `Store`, `DayOfWeek`, `Promo`, `CompetitionDistance`, `Month`
   - Saved as `week7_monitoring/baseline_stats.json`
   - Uploaded to S3: `ml-forecasting/monitoring/baseline/`

2. **Wrote `drift_simulator.py`**
   - 2 types of synthetic drift:

   | Type | Change | Real-world Meaning |
   |------|-------|--------------------|
   | `shift` | CompetitionDistance × 3, Promo → 80% | Market competition intensifies |
   | `noise` | DayOfWeek randomized | Data pipeline failure |

3. **Z-score Based Drift Detection**
   ```
   z_score = |mean_new - mean_baseline| / std_baseline
   Alert when z_score > 2.0
   ```

4. **CloudWatch Dashboard**
   - Dashboard: `RossmannForecastingDashboard`
   - Widgets: Request count, Lambda duration & error rate, Drift Detection Status table

---

### Results

**Drift Detection:**

| Scenario | Alerts | Result |
|---------|--------|--------|
| Normal data (test set) | 0 alerts | ✅ No false alarm |
| Drifted data (shift type) | 2 alerts | ✅ Correctly detected |

**Drift Detail:**

| Feature | Baseline Mean | Current Mean | z-score | Status |
|---------|--------------|-------------|---------|--------|
| CompetitionDistance | 5,430.34 | 16,291.02 | 6.83 | ⚠️ DRIFT |
| Promo | 0.38 | 0.80 | 4.21 | ⚠️ DRIFT |
| Store | 558.43 | 558.43 | 0.00 | ✅ OK |
| DayOfWeek | 3.99 | 4.00 | 0.01 | ✅ OK |
| Month | 7.22 | 7.22 | 0.01 | ✅ OK |

---

### Lessons Learned
- When no new data is available, `drift_simulator.py` is a valid and practical monitoring test strategy
- z-score threshold = 2.0 is a standard statistical threshold for anomaly detection
- CloudWatch dashboard provides at-a-glance visibility for model health
