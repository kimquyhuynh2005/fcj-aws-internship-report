---
title: "Dọn dẹp Tài nguyên AWS (Cleanup)"
date: 2026-06-06
weight: 6
chapter: false
pre: "<b>5.6. </b>"
---

## Bước 6: Dọn dẹp Tài nguyên AWS

{{% notice warning %}}
**Quan trọng:** SageMaker Endpoint tính phí theo giờ ngay cả khi không sử dụng. Nhóm thực hiện chạy script dọn dẹp ngay sau khi hoàn thành kiểm thử.
{{% /notice %}}

### Chạy script dọn dẹp tự động:

```bash
python week6_deployment/cleanup.py
```

### Các tài nguyên đã được xóa:
1. SageMaker Endpoint (`rossmann-forecasting-endpoint`)
2. Endpoint Config (`rossmann-config-*`)
3. SageMaker Model (`rossmann-xgboost-*`)

---

**Mã nguồn Dự án:** [github.com/kimquyhuynh2005/aws-internship-ML-forecasting](https://github.com/kimquyhuynh2005/aws-internship-ML-forecasting/)
