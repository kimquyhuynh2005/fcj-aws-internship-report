---
title: "Báo cáo thực tập"
date: 2026-06-06
weight: 1
chapter: false
---

# Báo cáo thực tập — AWS First Cloud AI Journey

{{% notice info %}}
Báo cáo này ghi lại quá trình thực tập thực tế tại **Amazon Web Services Viet Nam Company Limited** thông qua chương trình **First Cloud AI Journey**. Toàn bộ nội dung phản ánh công việc thực tế trong khoảng thời gian từ tháng 6 đến tháng 9 năm 2026.
{{% /notice %}}

## Thông tin sinh viên

<div style="display: flex; gap: 24px; align-items: flex-start; margin-top: 15px; margin-bottom: 25px; flex-wrap: wrap;">
  <div style="flex-shrink: 0; text-align: center;">
    <img src="/images/avatar.png" alt="Ảnh thẻ Huỳnh Kim Quý" style="width: 160px; height: 210px; object-fit: cover; border-radius: 10px; border: 3px solid #0284c7; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); display: block;" />
    <small style="display: block; margin-top: 8px; color: #94a3b8; font-size: 0.82rem;">(Ảnh thẻ thực tập sinh)</small>
  </div>
  <div style="flex: 1; min-width: 280px; line-height: 1.8;">
    <p style="margin-bottom: 6px;"><strong>Họ và tên:</strong> Huỳnh Kim Quý</p>
    <p style="margin-bottom: 6px;"><strong>Số điện thoại:</strong> 0911263926</p>
    <p style="margin-bottom: 6px;"><strong>Email:</strong> kimquyhuynh2005@gmail.com</p>
    <p style="margin-bottom: 6px;"><strong>Trường:</strong> Đại học Bách Khoa TP.HCM (HCMUT)</p>
    <p style="margin-bottom: 6px;"><strong>Chuyên ngành:</strong> Khoa học Máy tính</p>
    <p style="margin-bottom: 6px;"><strong>Lớp:</strong> AWS062026</p>
    <p style="margin-bottom: 6px;"><strong>Công ty thực tập:</strong> Amazon Web Services Viet Nam Company Limited</p>
    <p style="margin-bottom: 6px;"><strong>Vị trí thực tập:</strong> Workforce Bootcamp — First Cloud AI Journey</p>
    <p style="margin-bottom: 6px;"><strong>Thời gian thực tập:</strong> 06/06/2026 → 06/09/2026 (12 tuần)</p>
  </div>
</div>

---

## Tổng quan dự án

**Dự án:** Hệ thống Dự báo Doanh số Thương mại Điện tử trên AWS

> Xây dựng hệ thống Machine Learning end-to-end trên AWS để dự báo doanh số bán hàng theo ngày cho chuỗi cửa hàng bán lẻ (dataset Rossmann, hơn 1 triệu bản ghi), bao gồm: tiền xử lý dữ liệu, huấn luyện mô hình, triển khai API thời gian thực, giám sát và tự động hoá pipeline.

**Nhóm thực hiện:** 3 thành viên
| Thành viên | Vai trò |
|------------|---------|
| **Huỳnh Kim Quý** (báo cáo này) | Data / ML Engineering |
| Văn Thái Quân | Infrastructure / AWS |
| Nguyễn Ngọc Sáng | Backend / Monitoring |

### 🏆 So sánh Kết quả Huấn luyện Mô hình

<div class="model-card-grid">
  <div class="model-card winner-card">
    <span class="badge-pill badge-winner">⭐ Production Selected</span>
    <h3 style="margin-top: 10px; color: #ffffff !important;">XGBoost Baseline</h3>
    <p style="color: #94a3b8; font-size: 0.9rem;">Mô hình chính được triển khai REST API lên AWS SageMaker Endpoint</p>
    <div class="card-metrics">
      <div>
        <small style="color: #94a3b8;">TEST RMSE</small>
        <div class="metric-number">925.28</div>
      </div>
      <div>
        <small style="color: #94a3b8;">TEST MAPE</small>
        <div class="metric-number">9.92%</div>
      </div>
    </div>
  </div>

  <div class="model-card">
    <span class="badge-pill badge-experiment">Experiment</span>
    <h3 style="margin-top: 10px; color: #ffffff !important;">PyTorch LSTM</h3>
    <p style="color: #94a3b8; font-size: 0.9rem;">Mô hình Deep Learning 2-layer LSTM thử nghiệm chuỗi thời gian</p>
    <div class="card-metrics">
      <div>
        <small style="color: #94a3b8;">TEST RMSE</small>
        <div class="metric-number" style="color: #cbd5e1;">3,044.43</div>
      </div>
      <div>
        <small style="color: #94a3b8;">TEST MAPE</small>
        <div class="metric-number" style="color: #cbd5e1;">32.79%</div>
      </div>
    </div>
  </div>
</div>

---

## Cấu trúc báo cáo

| Phần | Nội dung |
|------|---------|
| **1. Worklog** | Nhật ký hoạt động từng tuần (Tuần 1 → 12) |
| **2. Đề xuất dự án** | Proposal, kiến trúc, timeline, rủi ro |
| **3. Bài viết Blog** | 3 bài viết chuyên môn đăng trên nhóm AWS Study Group |
| **4. Sự kiện tham gia** | Các sự kiện và workshop AWS đã tham dự |
| **5. Workshop** | Workshop kỹ thuật: ML Forecasting Pipeline trên AWS |
| **6. Tự đánh giá** | Đánh giá theo 8 tiêu chí kỹ năng |
| **7. Cảm nhận** | Phản hồi về chương trình và đề xuất cải tiến |