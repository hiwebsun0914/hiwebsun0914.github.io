> <font style="color:#000000;">✅</font><font style="color:#000000;"> 本教程适用于 </font>**<font style="color:#000000;">Windows + PyCharm + Anaconda + NVIDIA GPU（支持CUDA）</font>**<font style="color:#000000;"> 环境。你将完成以下目标：</font>
>
> + <font style="color:#000000;">✅</font><font style="color:#000000;"> 新建 GPU 环境</font>
> + <font style="color:#000000;">✅</font><font style="color:#000000;"> 安装 CUDA + CuDNN + PyTorch + torchaudio</font>
> + <font style="color:#000000;">✅</font><font style="color:#000000;"> 下载 Demucs 模型权重</font>
> + <font style="color:#000000;">✅</font><font style="color:#000000;"> 运行脚本并输出人声与伴奏</font>
> + <font style="color:#000000;">✅</font><font style="color:#000000;"> 分析时域图与频谱图</font>
>

---

### 🧩 一、准备工作
#### ✅ 1. 安装 Pycharm
---

### 🧪 二、新建 GPU 环境并安装依赖
#### ✅ 1. 创建 conda 环境（推荐 Python 3.10）
```bash
conda create -n demucs_env python=3.10 -y
conda activate demucs_env
```

---

#### ✅ 2. 安装 CUDA 加速的 PyTorch（适配你的显卡）
可查阅：[https://pytorch.org/get-started/locally/](https://pytorch.org/get-started/locally/)

例如，若你显卡支持 CUDA 12.1，执行如下命令：

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

如果显卡只支持 CUDA 11.8：

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

---

#### ✅ 3. 安装 Demucs 及其依赖
```bash
pip install demucs librosa soundfile matplotlib
```

验证是否安装成功：

```bash
python -c "import torch; print(torch.cuda.is_available())"
# 输出 True 表示 GPU 可用
```

---

### 🧠 三、下载 Demucs 预训练模型（权重）
运行前 Demucs 会自动从 Meta 官网下载模型文件，但你也可以手动下载：

#### ✅ 推荐模型：htdemucs_ft（人声分离效果好）
模型下载地址：

> [https://dl.fbaipublicfiles.com/demucs/v4/htdemucs_ft-6ddbab84.th](https://dl.fbaipublicfiles.com/demucs/v4/htdemucs_ft-6ddbab84.th)
>

#### ✅ 下载后放入以下路径（手动创建文件夹）：
```plain
C:\Users\你的用户名\.cache\torch\hub\checkpoints\
```

文件名保持为：

```plain
htdemucs_ft-6ddbab84.th
```

---

### 🚀 四、运行脚本进行分离与图像分析
将以下完整代码保存为 `MP3department.py`，与音频文件（如 `ZaZaZsu.wav`）放在同一文件夹中。

#### ✅ Python 脚本 `MP3department.py`
```python
import os
import torch
import librosa
import numpy as np
import matplotlib.pyplot as plt
import soundfile as sf
from demucs.pretrained import get_model
from demucs.apply import apply_model

# 防止 OpenMP 冲突
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# ========== 设置路径 ==========
INPUT_PATH = 'ZaZaZsu.wav'
OUTPUT_DIR = 'separated_outputs'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ========== 设备检测 ==========
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"[INFO] Using device: {device}")

# ========== 加载音频 ==========
print("[INFO] Loading audio...")
y, sr = librosa.load(INPUT_PATH, sr=None, mono=True)
y_stereo = np.stack([y, y], axis=0)
waveform = torch.tensor(y_stereo).float().unsqueeze(0).to(device)

# ========== 加载模型 ==========
print("[INFO] Loading Demucs model...")
model = get_model("htdemucs_ft").to(device)

# ========== 音频分离 ==========
print("[INFO] Performing source separation...")
with torch.no_grad():
    output = apply_model(model, waveform, split=True)[0].cpu().numpy()
    output = np.transpose(output, (0, 2, 1))

# ========== 保存人声与伴奏 ==========
sources = model.sources
vocals_index = sources.index("vocals")
accomp_indices = [i for i in range(len(sources)) if i != vocals_index]
accompaniment = sum(output[i] for i in accomp_indices)

sf.write(os.path.join(OUTPUT_DIR, "vocals.wav"), output[vocals_index], sr)
sf.write(os.path.join(OUTPUT_DIR, "accompaniment.wav"), accompaniment, sr)
print("[+] Exported vocals.wav and accompaniment.wav")

# ========== 合成图像：时域+频域 ==========
def plot_wave_and_fft(signal, title, filename):
    left = signal[:, 0]
    time = np.linspace(0, len(left)/sr, len(left))
    fft = np.fft.fft(left)
    freqs = np.fft.fftfreq(len(fft), 1/sr)

    plt.figure(figsize=(14, 5))

    plt.subplot(1, 2, 1)
    plt.plot(time, left, color='blue')
    plt.title(f'{title} - Time Domain')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')

    plt.subplot(1, 2, 2)
    plt.plot(freqs[:len(freqs)//2], np.abs(fft[:len(fft)//2]), color='red')
    plt.title(f'{title} - Frequency Domain')
    plt.xlabel('Frequency (Hz)')
    plt.ylabel('Magnitude')

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, filename))
    plt.close()

plot_wave_and_fft(output[vocals_index], "Vocals", "vocals_combined_plot.png")
plot_wave_and_fft(accompaniment, "Accompaniment", "accompaniment_combined_plot.png")
print("[+] Plots saved.")
```

---

### 📊 五、查看输出结果
运行脚本后你会获得以下内容：

| 文件名 | 描述 |
| --- | --- |
| `vocals.wav` | 分离出的人声 |
| `accompaniment.wav` | 纯伴奏（不含人声） |
| `vocals_combined_plot.png` | 人声的时域和频域图像 |
| `accompaniment_combined_plot.png` | 伴奏的时域和频域图像 |


你可以使用任意播放器试听，也可用 `matplotlib` 打开图像查看音频频谱差异。

---

### ❓FAQ：模型是如何区分人声与伴奏的？
Demucs 使用的是**深度神经网络**，它不是靠简单的频率分割，而是通过大量训练**学习人声的特征（如发音、共振、包络、节奏等）**与伴奏的差异。

> 比如：即使人声和钢琴都在中频段，模型也能分清楚“这是人在唱”还是“这是钢琴在弹”，靠的是**声纹识别能力**而非纯频率。
>

---



