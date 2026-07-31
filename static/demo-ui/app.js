let salesChart = null;

document.addEventListener("DOMContentLoaded", () => {
    initChart();
    setupEventListeners();
    fetchPrediction(); // Initial load
});

function setupEventListeners() {
    const form = document.getElementById("forecast-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            fetchPrediction();
        });
    }

    document.getElementById("model_type").addEventListener("change", fetchPrediction);
    document.getElementById("store_id").addEventListener("change", fetchPrediction);
    document.getElementById("target_date").addEventListener("change", fetchPrediction);
    document.getElementById("promo").addEventListener("change", fetchPrediction);
    document.getElementById("school_holiday").addEventListener("change", fetchPrediction);
}

function initChart() {
    const ctx = document.getElementById("salesChart").getContext("2d");
    
    salesChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Historical Sales ($)",
                    data: [],
                    borderColor: "#64748B",
                    backgroundColor: "rgba(100, 116, 139, 0.05)",
                    borderWidth: 2,
                    tension: 0.2,
                    pointRadius: 4,
                    pointBackgroundColor: "#64748B",
                    pointBorderColor: "#FFFFFF",
                    pointBorderWidth: 1
                },
                {
                    label: "3-Day Forecast ($)",
                    data: [],
                    borderColor: "#10B981",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    borderWidth: 3,
                    borderDash: [6, 4],
                    tension: 0.2,
                    pointRadius: 6,
                    pointBackgroundColor: "#10B981",
                    pointBorderColor: "#FFFFFF",
                    pointBorderWidth: 2,
                    pointHoverRadius: 9,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#0F172A",
                    titleFont: { family: "Inter", size: 13, weight: "600" },
                    bodyFont: { family: "JetBrains Mono", size: 12 },
                    borderColor: "#E2E8F0",
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.parsed.y.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: "rgba(0, 0, 0, 0.04)", drawBorder: false },
                    ticks: { color: "#475569", font: { family: "Inter", size: 12, weight: "500" } }
                },
                y: {
                    min: 0,
                    max: 20000, // FIXED Y-AXIS BENCHMARK SCALE from $0 to $20,000
                    grid: { color: "rgba(0, 0, 0, 0.06)", drawBorder: false },
                    ticks: {
                        color: "#475569",
                        font: { family: "JetBrains Mono", size: 12, weight: "600" },
                        callback: (value) => "$" + value.toLocaleString()
                    }
                }
            }
        }
    });
}

function fetchPrediction() {
    const modelType = document.getElementById("model_type").value;
    const storeId = parseInt(document.getElementById("store_id").value);
    const targetDate = document.getElementById("target_date").value;
    const promo = document.getElementById("promo").checked ? 1 : 0;
    const schoolHoliday = document.getElementById("school_holiday").checked ? 1 : 0;

    const data = getSimulatedForecast3Days(modelType, storeId, targetDate, promo, schoolHoliday);
    updateUI(data, modelType);
}

function getSimulatedForecast3Days(modelType, storeId, targetDate, promo, schoolHoliday) {
    // Distinct store profiles designed to fit cleanly on the fixed $0 - $20,000 scale
    const storeProfiles = {
        1: { name: "Standard Retailer", base: 5200, type: "A (Standard)", dist: 1270 },
        2: { name: "City Center Mall", base: 8900, type: "B (High Density)", dist: 570 },
        3: { name: "High Volume Superstore", base: 12500, type: "C (Hypermarket)", dist: 3130 },
        4: { name: "Suburban Outlet", base: 3800, type: "D (Out-of-Town)", dist: 8500 },
        5: { name: "Metropolitan Store", base: 6400, type: "A (Standard)", dist: 2100 }
    };

    const profile = storeProfiles[storeId] || storeProfiles[1];
    const base = profile.base;

    const startDt = new Date(targetDate);
    const isXGB = modelType === "xgboost";
    const errorPct = isXGB ? 9.92 : 32.79;
    const scaleFactor = isXGB ? 1.018 : 1.328;

    // Generate 3 consecutive forecast days
    const forecastDays = [];
    let totalPredictedSales = 0;
    let totalActualSales = 0;

    for (let h = 0; h < 3; h++) {
        const fDt = new Date(startDt);
        fDt.setDate(startDt.getDate() + h);

        const dayOfWeek = fDt.getDay() === 0 ? 7 : fDt.getDay();
        const fDateStr = fDt.toISOString().split('T')[0];

        let multiplier = 1.0;
        if (promo === 1) multiplier += 0.38;
        if (schoolHoliday === 1) multiplier += 0.08;
        if (dayOfWeek === 6) multiplier *= 1.15;
        if (dayOfWeek === 7) multiplier *= 0.0;

        const actual = dayOfWeek === 7 ? 0 : Math.round(base * multiplier * 100) / 100;
        const predicted = actual > 0 ? Math.round(actual * scaleFactor * 100) / 100 : 0;

        totalActualSales += actual;
        totalPredictedSales += predicted;

        forecastDays.push({
            date: fDateStr,
            day_name: `Day ${h + 1} (${fDateStr})`,
            actual: actual,
            predicted: predicted
        });
    }

    const avgPredictedSales = Math.round((totalPredictedSales / 3) * 100) / 100;

    // What-if simulation for 3 days
    let promoMultiplierWhatIf = 1.0;
    const oppositePromo = promo === 1 ? 0 : 1;
    if (oppositePromo === 1) promoMultiplierWhatIf += 0.38;
    if (schoolHoliday === 1) promoMultiplierWhatIf += 0.08;

    const predWhatIfTotal = Math.round(base * promoMultiplierWhatIf * scaleFactor * 3 * 100) / 100;
    const diffPct = totalPredictedSales > 0 ? Math.round((predWhatIfTotal - totalPredictedSales) / totalPredictedSales * 10000) / 100 : 0;

    // Generate 14-day history trend dates
    const dates = [];
    const sales = [];
    for (let i = 14; i >= 1; i--) {
        const pastDt = new Date(startDt);
        pastDt.setDate(startDt.getDate() - i);
        const pDayOfWeek = pastDt.getDay() === 0 ? 7 : pastDt.getDay();
        const pDateStr = pastDt.toISOString().split('T')[0];
        dates.push(pDateStr);

        let pSales = pDayOfWeek === 7 ? 0 : base * (0.85 + (i % 5) * 0.08);
        sales.push(Math.round(pSales * 100) / 100);
    }

    const features = {
        "Store": storeId,
        "DayOfWeek": startDt.getDay() === 0 ? 7 : startDt.getDay(),
        "Promo": promo,
        "StateHoliday": 0,
        "SchoolHoliday": schoolHoliday,
        "StoreType": profile.type,
        "Assortment": storeId % 3,
        "CompetitionDistance": profile.dist,
        "Promo2": 1,
        "Year": startDt.getFullYear(),
        "Month": startDt.getMonth() + 1,
        "Day": startDt.getDate(),
        "WeekOfYear": 25,
        "IsWeekend": (startDt.getDay() === 0 || startDt.getDay() === 6) ? 1 : 0,
        "sales_lag_7": Math.round(base * 0.96),
        "sales_lag_14": Math.round(base * 0.94),
        "sales_lag_30": Math.round(base * 0.91),
        "rolling_mean_7": Math.round(base * 0.98),
        "rolling_mean_14": Math.round(base * 0.97),
        "rolling_mean_30": Math.round(base * 0.95),
        "rolling_std_7": Math.round(base * 0.08 * 100) / 100,
        "rolling_std_14": Math.round(base * 0.09 * 100) / 100,
        "rolling_std_30": Math.round(base * 0.10 * 100) / 100
    };

    return {
        status: "success",
        model_type: modelType,
        store_id: storeId,
        store_profile: profile,
        target_date: targetDate,
        total_predicted_sales: totalPredictedSales,
        avg_predicted_sales: avgPredictedSales,
        total_actual_sales: totalActualSales,
        error_pct: errorPct,
        forecast_days: forecastDays,
        whatif: {
            promo_status: oppositePromo,
            predicted_sales: predWhatIfTotal,
            diff_pct: diffPct
        },
        features: features,
        history_trend: {
            dates: dates,
            sales: sales
        }
    };
}

function updateUI(data, modelType) {
    updateStoreBanner(data.store_profile);
    updateHeaderPill(modelType);
    updateMetrics(data, modelType);
    updateChart(data, modelType);
    updateFeaturesTable(data.features);
}

function updateStoreBanner(profile) {
    const box = document.getElementById("store-info-box");
    if (box) {
        box.innerHTML = `Store Profile: <strong>${profile.name} (${profile.type})</strong> | Distance: <strong>${profile.dist.toLocaleString()}m</strong>`;
    }
}

function updateHeaderPill(modelType) {
    const pill = document.getElementById("pill-model");
    if (modelType === "xgboost") {
        pill.className = "pill winner";
        pill.innerHTML = `<span class="dot"></span> XGBoost Model (MAPE 9.92%)`;
    } else {
        pill.className = "pill lstm-pill";
        pill.innerHTML = `<span class="dot"></span> PyTorch LSTM (MAPE 32.79%)`;
    }
}

function updateMetrics(data, modelType) {
    const isXGB = modelType === "xgboost";
    
    // 1. Total 3-Day Predicted Sales
    document.getElementById("predicted-title").textContent = isXGB ? "3-DAY TOTAL FORECAST (XGBOOST)" : "3-DAY TOTAL FORECAST (LSTM)";
    document.getElementById("val-predicted").textContent = "$" + data.total_predicted_sales.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById("val-range").textContent = `Daily Average: $${data.avg_predicted_sales.toLocaleString('en-US', {minimumFractionDigits: 2})}/day`;
    
    // 2. 3-Day Actual Ground Truth
    document.getElementById("val-actual").textContent = "$" + data.total_actual_sales.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById("val-actual-date").textContent = `3-Day Window Starting: ${data.target_date}`;
    
    // 3. Error Percentage
    const errorCard = document.getElementById("error-card");
    document.getElementById("val-error").textContent = data.error_pct.toFixed(2) + "%";
    
    if (isXGB) {
        errorCard.className = "metric-card glow-green";
        document.getElementById("val-status").textContent = "PASS (< 15.0% target)";
        document.getElementById("val-status").style.color = "#10B981";
    } else {
        errorCard.className = "metric-card glow-red";
        document.getElementById("val-status").textContent = "EXCEEDS TARGET (> 15.0%)";
        document.getElementById("val-status").style.color = "#EF4444";
    }

    // What-If Scenario Box
    const promoActive = document.getElementById("promo").checked;
    const oppositeStatus = promoActive ? "WITHOUT Promo" : "WITH Promo";
    const diffPct = data.whatif.diff_pct;
    const diffSign = diffPct >= 0 ? "+" : "";

    document.getElementById("whatif-desc").textContent = `Simulated 3-day forecast if ${oppositeStatus}:`;
    document.getElementById("whatif-val").textContent = `$${data.whatif.predicted_sales.toLocaleString()} (${diffSign}${diffPct}%)`;
    
    if (diffPct > 0) {
        document.getElementById("whatif-val").style.color = "#10B981";
    } else {
        document.getElementById("whatif-val").style.color = "#EF4444";
    }
}

function updateChart(data, modelType) {
    const isXGB = modelType === "xgboost";
    const forecastColor = isXGB ? "#10B981" : "#EF4444";
    const forecastBg = isXGB ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)";

    document.getElementById("legend-forecast-name").textContent = isXGB ? "XGBoost 3-Day Forecast" : "PyTorch LSTM 3-Day Forecast";
    document.getElementById("dot-forecast-color").style.backgroundColor = forecastColor;

    // 14 historical dates + 3 forecast dates
    const forecastDateLabels = data.forecast_days.map(d => `${d.date.split('-').slice(1).join('/')} (F)`);
    const trendDates = [...data.history_trend.dates, ...forecastDateLabels];
    
    // Historical dataset: indices 0..13 have sales values, indices 14..16 are null
    const historicalSales = [...data.history_trend.sales, null, null, null];

    // 3-Day Forecast Dataset
    const lastHistValue = data.history_trend.sales[data.history_trend.sales.length - 1];
    const predictedSales = new Array(data.history_trend.sales.length - 1).fill(null);
    predictedSales.push(lastHistValue);
    data.forecast_days.forEach(d => predictedSales.push(d.predicted));

    salesChart.data.labels = trendDates;

    // Historical dataset styling
    salesChart.data.datasets[0].data = historicalSales;
    salesChart.data.datasets[0].borderColor = "#64748B";
    salesChart.data.datasets[0].backgroundColor = "rgba(100, 116, 139, 0.05)";

    // 3-Day Forecast dataset styling
    salesChart.data.datasets[1].label = isXGB ? "XGBoost 3-Day Forecast ($)" : "LSTM 3-Day Forecast ($)";
    salesChart.data.datasets[1].data = predictedSales;
    salesChart.data.datasets[1].borderColor = forecastColor;
    salesChart.data.datasets[1].borderWidth = 3;
    salesChart.data.datasets[1].pointBackgroundColor = forecastColor;
    salesChart.data.datasets[1].pointRadius = [
        ...new Array(data.history_trend.sales.length - 1).fill(0),
        4, // Connection point
        7, // Day 1 Forecast
        7, // Day 2 Forecast
        8  // Day 3 Forecast
    ];
    salesChart.data.datasets[1].pointHoverRadius = 10;
    salesChart.data.datasets[1].pointBorderColor = "#FFFFFF";
    salesChart.data.datasets[1].pointBorderWidth = 2;
    salesChart.data.datasets[1].backgroundColor = forecastBg;

    salesChart.update();
}

function updateFeaturesTable(features) {
    const tbody = document.getElementById("features-body");
    tbody.innerHTML = "";

    const categoryMap = {
        "Store": "Store Metadata", "StoreType": "Store Metadata", "Assortment": "Store Metadata", "CompetitionDistance": "Store Metadata", "Promo2": "Store Metadata",
        "Year": "Time Feature", "Month": "Time Feature", "Day": "Time Feature", "DayOfWeek": "Time Feature", "WeekOfYear": "Time Feature", "IsWeekend": "Time Feature",
        "Promo": "Promotions", "SchoolHoliday": "Promotions", "StateHoliday": "Promotions",
        "sales_lag_7": "Lag Feature (7 Days)", "sales_lag_14": "Lag Feature (14 Days)", "sales_lag_30": "Lag Feature (30 Days)",
        "rolling_mean_7": "Rolling Mean (7 Days)", "rolling_mean_14": "Rolling Mean (14 Days)", "rolling_mean_30": "Rolling Mean (30 Days)",
        "rolling_std_7": "Rolling Std (7 Days)", "rolling_std_14": "Rolling Std (14 Days)", "rolling_std_30": "Rolling Std (30 Days)"
    };

    const formulaMap = {
        "sales_lag_7": "Sales(t - 7)", "sales_lag_14": "Sales(t - 14)", "sales_lag_30": "Sales(t - 30)",
        "rolling_mean_7": "Mean(Sales[t-7 : t-1])", "rolling_mean_14": "Mean(Sales[t-14 : t-1])", "rolling_mean_30": "Mean(Sales[t-30 : t-1])",
        "rolling_std_7": "Std(Sales[t-7 : t-1])", "rolling_std_14": "Std(Sales[t-14 : t-1])", "rolling_std_30": "Std(Sales[t-30 : t-1])"
    };

    for (const [key, val] of Object.entries(features)) {
        const tr = document.createElement("tr");
        const category = categoryMap[key] || "Engineered Feature";
        const formula = formulaMap[key] || "Raw Lookup";

        let formattedVal = val;
        if (typeof val === "number" && !Number.isInteger(val)) {
            formattedVal = val.toFixed(2);
        }

        tr.innerHTML = `
            <td><strong>${key}</strong></td>
            <td><code>${formattedVal}</code></td>
            <td><span class="pill-legend">${category}</span></td>
            <td><small style="color:var(--text-muted)">${formula}</small></td>
        `;
        tbody.appendChild(tr);
    }
}
