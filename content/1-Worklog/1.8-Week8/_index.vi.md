---
title: "Tuần 8 — Pipeline + Refactor"
date: 2026-07-25
weight: 8
chapter: false
pre: "<b>1.8. </b>"
---

## Tuần 8 — Pipeline + Refactor ✅

**Người thực hiện:** Văn Thái Quân | **Thời gian:** 25/07/2026 – 31/07/2026

---

### Bối cảnh
Mục tiêu: tự động hoá toàn bộ pipeline ML. Rào cản: Training Jobs quota = 0 trên cả account nhóm lẫn cá nhân. Giải pháp kép: tạo Pipeline definition trên AWS (IaC) + chạy Local Orchestration làm Proof of Concept.

### Công việc đã làm

1. **Viết `pipeline_definition.py`**
   - Định nghĩa Pipeline JSON theo chuẩn AWS với 3 steps:
     - **Step 1 — Processing:** chạy `preprocessing.py` trên `ml.t3.medium`
     - **Step 2 — Training:** train XGBoost trên `ml.m5.large`
     - **Step 3 — Condition:** chỉ register model nếu RMSE ≤ 1000
   - Dùng boto3 thuần, không dùng SageMaker SDK

2. **Tạo SageMaker Pipeline trên AWS**
   ```
   Pipeline ARN:
   arn:aws:sagemaker:ap-southeast-1:897355252080:pipeline/Rossmann-Sales-Pipeline-20260723222102
   ```
   > Pipeline sẵn sàng 100% cho Production — chờ AWS duyệt tăng quota Training Jobs

3. **Viết và chạy `simple_orchestration.py`** (Local PoC)
   - Thay thế SageMaker Pipelines thật khi quota = 0
   - 5 bước tuần tự với quality gates:
     1. Preprocessing
     2. Training XGBoost
     3. Deploy Endpoint
     4. Smoke Test Endpoint
     5. Validate Model Accuracy (MAPE threshold 15%)
   - Cleanup tự động sau khi hoàn tất

4. **Refactor codebase sang cấu trúc `src/`**
   - `src/data/` — preprocessing.py, dataset.py
   - `src/models/` — xgboost_trainer.py, lstm_model.py, lstm_trainer.py
   - `src/serving/` — inference.py, lambda_function.py
   - `monitoring/` — drift_simulator.py

---

### Kết quả đạt được

**Local Orchestration (Proof of Concept):**

| Bước | Thời gian | Kết quả |
|------|----------|--------|
| Preprocessing | 8.2s | 785,727 rows ✅ |
| Training XGBoost | 147.1s | RMSE 929.83, MAPE 9.81% ✅ |
| Deploy Endpoint | 426.4s | InService ✅ |

---

### 💻 Code Snippet Nổi bật

#### 1. Định nghĩa SageMaker Pipeline bằng Boto3 (`pipeline_definition.py`)
```python
import json
import boto3

sm_client = boto3.client('sagemaker', region_name='ap-southeast-1')

pipeline_definition = {
    "Version": "2020-12-01",
    "Metadata": {},
    "Parameters": [{"Name": "ProcessingInstanceType", "Type": "String", "DefaultValue": "ml.t3.medium"}],
    "PipelineExperimentConfig": {"ExperimentName": "RossmannPipelineExp"},
    "Steps": [
        {
            "Name": "PreprocessData",
            "Type": "Processing",
            "Arguments": {"ProcessingResources": {"ClusterConfig": {"InstanceCount": 1, "InstanceType": "ml.t3.medium"}}}
        },
        {
            "Name": "TrainXGBoost",
            "Type": "Training",
            "Arguments": {"AlgorithmSpecification": {"TrainingInputMode": "File"}}
        }
    ]
}

# Tạo hoặc Cập nhật Pipeline trên AWS
response = sm_client.create_pipeline(
    PipelineName='Rossmann-Sales-Pipeline',
    PipelineDefinition=json.dumps(pipeline_definition),
    RoleArn='arn:aws:iam::897355252080:role/SageMaker-ExecutionRole-QuanVan'
)
print(f"✅ Created SageMaker Pipeline ARN: {response['PipelineArn']}")
```

#### 2. Local Orchestration Runner (`simple_orchestration.py`)
```python
import subprocess
import sys
import time

def run_step(step_name, command):
    print(f"\n🚀 Running Step: {step_name}...")
    start_time = time.time()
    result = subprocess.run(command, shell=True)
    duration = time.time() - start_time
    
    if result.returncode != 0:
        print(f"❌ Step '{step_name}' failed after {duration:.1f}s")
        sys.exit(1)
    print(f"✅ Step '{step_name}' completed in {duration:.1f}s")

if __name__ == '__main__':
    run_step("1. Preprocessing", "python src/data/preprocessing.py")
    run_step("2. XGBoost Training", "python src/models/xgboost_trainer.py")
    run_step("3. Drift Simulation", "python monitoring/drift_simulator.py")
    print("\n🎉 End-to-End Orchestration Completed Successfully!")
```
| Smoke Test | 2.4s | predicted_sales: 5301.91 ✅ |
| Validate Accuracy | 3.9s | Sai lệch 5.14% < 15% ✅ PASS |
| **Tổng** | **587.9s** | **✅ Hoàn tất** |

**Cleanup:**
```
✅ Đã xóa Endpoint: rossmann-forecasting-endpoint
✅ Đã xóa Endpoint Config: rossmann-config-1784874810
✅ Đã xóa Model: rossmann-xgboost-1784874810
```

---

### Bài học rút ra
- Pipeline IaC (boto3) đã sẵn sàng Production — quota là rào cản duy nhất
- Local orchestration PoC chứng minh logic hoạt động đúng end-to-end không cần chi phí cloud
- Luôn thêm quality gates (MAPE threshold) trong orchestration để ngăn deploy model xấu
- Cleanup ngay sau demo — SageMaker Endpoint tính phí theo giờ
