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

&emsp; **Họ và tên:** Huỳnh Kim Quý

&emsp; **Số điện thoại:** 0911263926

&emsp; **Email:** kimquyhuynh2005@gmail.com

&emsp; **Trường:** Đại học Bách Khoa TP.HCM (HCMUT)

&emsp; **Chuyên ngành:** Khoa học Máy tính

&emsp; **Lớp:** AWS062026

&emsp; **Công ty thực tập:** Amazon Web Services Viet Nam Company Limited

&emsp; **Vị trí thực tập:** Workforce Bootcamp — First Cloud AI Journey

&emsp; **Thời gian thực tập:** 06/06/2026 → 06/09/2026 (12 tuần)

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

**Kết quả nổi bật:** Model XGBoost đạt **RMSE 925.28**, **MAPE 9.92%** — triển khai thành REST API qua SageMaker + Lambda + API Gateway

---

## Cấu trúc báo cáo

| Phần | Nội dung |
|------|---------|
| **1. Worklog** | Nhật ký hoạt động từng tuần (Tuần 1 → 12) |
| **2. Đề xuất dự án** | Proposal, kiến trúc, timeline, rủi ro |
| **3. Sự kiện tham gia** | Các sự kiện và workshop AWS đã tham dự |
| **4. Workshop** | Workshop kỹ thuật: ML Forecasting Pipeline trên AWS |
| **5. Tự đánh giá** | Đánh giá theo 8 tiêu chí kỹ năng |
| **6. Cảm nhận** | Phản hồi về chương trình và đề xuất cải tiến |