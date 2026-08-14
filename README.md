<div align="center">

<h1>Face Search AI</h1>

<p><b>Upload a face. Find every photo they're in.</b></p>
<p>An AI-powered reverse image search for faces — built on facial embeddings and vector similarity search.</p>

<br/>

<img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/FAISS-vector%20search-FF6F00?style=for-the-badge" />

<br/><br/>

<a href="#quick-start"><b>Quick Start</b></a> ·
<a href="#how-it-works"><b>How It Works</b></a> ·
<a href="#api-reference"><b>API</b></a> ·
<a href="#roadmap"><b>Roadmap</b></a>

</div>

<br/>

---

<br/>

## Overview

**Face Search AI** indexes every face in a photo collection, then lets you find all images containing a specific person by uploading a single reference photo.

It uses **InsightFace** for face detection and embedding generation, **FAISS** for fast nearest-neighbor search, and ships with a **FastAPI** backend and a **React** frontend.

> **A note on responsible use** — facial recognition carries real privacy implications. This project is built for consensual, personal use: organizing your own photo library, a family archive, or an event gallery you have rights to. Please don't use it to identify or track people without their knowledge, and check local regulations (GDPR, BIPA, etc.) before deploying it on data that isn't yours.

<br/>

## Features

- **Bulk upload** — index an entire photo collection in one pass
- **Multi-face detection** — handles group photos, not just headshots
- **Instant search** — upload one face, get every match back in milliseconds
- **Persistent index** — embeddings and metadata survive restarts
- **Modern UI** — responsive, animated React frontend

<br/>

## How It Works

```
  Upload            Detect             Embed              Index             Search
┌─────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Photos │ ───▶ │  Faces   │ ───▶ │ Vectors  │ ───▶ │  FAISS   │ ───▶ │ Matches  │
└─────────┘      └──────────┘      └──────────┘      └──────────┘      └──────────┘
```

1. **Upload** — submit one or more images, single-face or group shots
2. **Detect** — InsightFace locates every face in each image
3. **Embed** — each face becomes a high-dimensional feature vector
4. **Index** — vectors are stored in FAISS; metadata links them back to source images
5. **Search** — a query face is embedded and matched via similarity search
6. **Retrieve** — every matching photo is returned to the frontend

<br/>

## Tech Stack

<table>
<tr><td><b>Frontend</b></td><td>React · Vite · Tailwind CSS · Framer Motion · Lucide Icons</td></tr>
<tr><td><b>Backend</b></td><td>FastAPI · Python · OpenCV · NumPy</td></tr>
<tr><td><b>AI / ML</b></td><td>InsightFace · FAISS · ONNX Runtime</td></tr>
</table>

<br/>

## Quick Start

**Prerequisites:** Python 3.10+, Node.js 18+, ~2GB disk space for model weights

```bash
git clone https://github.com/khrishith/face-search-ai.git
cd face-search-ai
```

**Backend**

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

→ API at `localhost:8000` · Docs at `localhost:8000/docs`

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

→ App at `localhost:5173`

<br/>

## Configuration

Set these in `backend/.env`:

| Variable | Description | Default |
|:--|:--|:--|
| `MODEL_NAME` | InsightFace model pack | `buffalo_l` |
| `SIMILARITY_THRESHOLD` | Minimum similarity to count as a match | `0.5` |
| `DATA_DIR` | Uploaded image storage path | `./data` |
| `INDEX_PATH` | FAISS index file location | `./data/faiss.index` |
| `MAX_UPLOAD_SIZE_MB` | Max upload size per request | `50` |

<br/>

## API Reference

| Method | Endpoint | Description |
|:--|:--|:--|
| `POST` | `/upload` | Upload and index a photo collection |
| `POST` | `/search` | Search using a single face image |
| `GET` | `/health` | Health check |
| `DELETE` | `/reset` | Clear all data *(dev only)* |

```bash
curl -X POST http://localhost:8000/search -F "file=@query_face.jpg"
```

```json
{
  "matches": [
    { "image_id": "img_042", "similarity": 0.87, "url": "/data/img_042.jpg" },
    { "image_id": "img_118", "similarity": 0.81, "url": "/data/img_118.jpg" }
  ]
}
```

<br/>

## Roadmap

- [ ] User authentication & API keys
- [ ] Cloud storage (S3 / Cloudinary)
- [ ] Face clustering
- [ ] Duplicate image detection
- [ ] Video face search
- [ ] Docker & Kubernetes support

<br/>

---

<div align="center">

**MIT Licensed** · Built by [Hrishith Kadthala](https://github.com/khrishith)

If this project helped you, consider giving it a ⭐

</div>
