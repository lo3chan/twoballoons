# 🐍 twoballoons Antigravity Python Sidecar

This directory contains the Python sidecar process for **twoballoons**. It interfaces directly with the **Google Antigravity SDK (`google-antigravity`)** to stream real-time reasoning (`response.thoughts`) and spatial generative fill deltas.

---

## 🚀 How It Works

1. **FastAPI Daemon**: Runs locally on `http://127.0.0.1:50927`.
2. **Tauri IPC Integration**: Spawned as a child sidecar process by the Tauri 2.0 Rust engine (`tokio::process`).
3. **SSE Streaming Endpoints**:
   - `POST /generate/spatial-fill`: Receives spatial bounding-box AST fragments and streams real-time thoughts and AST token deltas.
   - `POST /generate/diagram`: Synthesizes complete LogiDSL, PhiloDSL, Mermaid, or PlantUML diagrams from natural language.
   - `GET /health`: Returns engine health and SDK availability.

---

## 🛠️ Local Development & Testing

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install requirements
pip install -r requirements.txt

# 3. Launch sidecar daemon
python antigravity_daemon.py
```
