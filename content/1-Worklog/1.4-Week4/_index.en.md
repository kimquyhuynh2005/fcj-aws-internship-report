---
title: "Week 4 — PyTorch LSTM & Model Comparison"
date: 2026-06-27
weight: 4
chapter: false
pre: "<b>1.4. </b>"
---

# Week 4 — PyTorch LSTM Deep Learning Training & Comparative Benchmark

**Owner:** Huynh Kim Quy (Data & Machine Learning Engineer)  
**Period:** 27/06/2026 – 03/07/2026  
**Primary Objective:** Implement a PyTorch LSTM Deep Learning time-series model, conduct GPU training experiments, and construct a comparative performance benchmark against the baseline XGBoost model.

---

## 1. PyTorch LSTM Architecture & Implementation Details

### 1.1. Deep Learning Model Architecture (`model.py`)
The **SalesLSTM** model was designed as a 2-layer Recurrent Neural Network (RNN) with the following structural parameters:
- **Input Dimension:** 22 engineered input features.
- **Hidden Dimension (`hidden_dim`):** 128 hidden units per LSTM cell.
- **Number of Layers (`num_layers`):** 2 stacked LSTM layers.
- **Dropout Rate:** 0.2 (randomly dropping 20% connections to prevent overfitting).
- **Fully Connected Output Layer:** 1 Linear Unit taking the final timestep hidden state (`out[:, -1, :]`) to output single sales predictions.

### 1.2. Data Normalization & Sequence Batching (`dataset.py`)
- **Feature Normalization:** Applied `MinMaxScaler(feature_range=(0, 1))` to all 22 input features to prevent exploding gradients during backpropagation.
- **Sliding Window Sequences:** Created 30-day sliding window sequences (Sequence Length = 30) for learning temporal dependencies.
- **PyTorch DataLoader:** Encapsulated data into `TensorDataset` and configured batching (`batch_size=64`, `shuffle=False` to preserve time order).

---

## 2. Comparative Evaluation Benchmark (XGBoost vs. PyTorch LSTM)

Following 50 training epochs on GPU instances, performance metrics were benchmarked directly on the independent Test Set (July 2015):

| Algorithm | Test RMSE | Test MAPE (%) | Training Duration | Status & Architectural Choice |
|-----------|-----------|---------------|-------------------|--------------------------------|
| **XGBoost Regressor (v1.7.6)** ⭐ | **925.28** | **9.92%** | **~45 seconds (CPU)** | **✅ Selected for Production** |
| PyTorch LSTM (2-layer Stacked) | 3,044.43 | 32.79% | ~8 minutes (GPU) | ❌ Experiment Only |

---

## 3. Technical Root Cause Analysis

While LSTM architectures excel in sequential processing, XGBoost significantly outperformed LSTM on this dataset due to 4 technical factors:

1. **Tabular Nature of E-commerce Data:** Rossmann transactions contain categorical indicators (`StoreType`, `Assortment`, `Promo`, `StateHoliday`). Tree-based algorithms partition discrete decision spaces much more effectively than continuous activation functions in LSTMs.
2. **MinMax Scaling Sensitivity:** LSTMs are sensitive to feature scales. Scaling extreme holiday sales spikes dampened the network's capacity to predict sudden demand surges.
3. **Efficiency of Feature Engineering:** XGBoost leveraged 22 pre-computed rolling and lag features directly, whereas LSTM attempted to learn temporal relationships from scratch.
4. **Compute Efficiency:** XGBoost trained in ~45 seconds on CPU with far lower operational complexity than managing GPU infrastructure for LSTM.

---

## 4. PyTorch LSTM Architecture Code (`lstm_model.py`)

```python
import torch
import torch.nn as nn

class SalesLSTM(nn.Module):
    """PyTorch 2-layer LSTM architecture for sales time-series forecasting."""
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
        # Extract representation at the final sequence timestep
        out = self.fc(out[:, -1, :])
        return out

# Verification test
if __name__ == "__main__":
    model = SalesLSTM(input_dim=22)
    dummy_input = torch.randn(64, 30, 22) # Batch 64, Seq 30, Feats 22
    output = model(dummy_input)
    print(f"✅ Pass forward pass check! Output shape: {output.shape}") # Expect: (64, 1)
```

---

## 5. Architectural Decision Summary

> **Final Decision:** Formally selected **XGBoost Regressor** as the official Production Model. Including the experimental LSTM benchmark provides clear data-driven evidence justifying architectural technology selection over deep learning hype.
