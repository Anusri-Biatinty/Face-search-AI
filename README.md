<div align="center">

# 🔎 Face Search AI

### **Find. Match. Discover.**

<p>
An AI-powered facial search engine that transforms photo collections into searchable face embeddings.
</p>

<p>
<b>Upload a reference face → Search your collection → Discover matching photos</b>
</p>

<br/>

<img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/FAISS-Vector%20Search-FF6F00?style=flat-square" />
<img src="https://img.shields.io/badge/InsightFace-AI-8A2BE2?style=flat-square" />

<br/><br/>

<a href="#-overview">Overview</a> • <a href="#-features">Features</a> • <a href="#-architecture">Architecture</a> • <a href="#-installation">Installation</a> • <a href="#-api">API</a> • <a href="#-roadmap">Roadmap</a>

</div>

---

## ✨ Overview

**Face Search AI** is an intelligent facial-search application designed to make large photo collections searchable.

Instead of manually looking through hundreds or thousands of images, users can provide a **reference face**, and the system searches the indexed collection for visually similar faces.

The application combines:

* 🧠 **InsightFace** for face detection and embeddings
* ⚡ **FAISS** for high-speed vector similarity search
* 🚀 **FastAPI** for the backend API
* ⚛️ **React + Vite** for the user interface
* 👁️ **OpenCV** for image processing
* 🔢 **NumPy** for numerical operations
* ⚙️ **ONNX Runtime** for efficient model execution

---

## 🎯 Why Face Search AI?

Traditional photo searching depends on filenames, folders, dates, or manually added tags.

Face Search AI approaches the problem differently:

```text
                 Traditional Search
                        │
                        ▼
              Filename / Folder / Tags
                        │
                        ▼
                   Manual Search


                 Face Search AI
                        │
                        ▼
                 Upload a Face
                        │
                        ▼
              Generate Embedding
                        │
                        ▼
               Vector Similarity
                        │
                        ▼
                Matching Photos
```

The result is a more intelligent way to explore personal photo collections.

---

# 🚀 Features

### 📸 Smart Photo Indexing

Upload a collection of images and automatically detect the faces present in them.

### 👥 Multi-Face Detection

Group photographs are supported. Multiple faces can be detected and indexed from a single image.

### 🔍 AI-Powered Face Search

Upload a single reference face and search the indexed collection for matching faces.

### ⚡ Fast Vector Search

FAISS enables efficient nearest-neighbor search across large collections of face embeddings.

### 💾 Persistent Index

Face embeddings and metadata can be stored so the search index remains available across application restarts.

### 🎨 Modern Web Interface

A responsive React frontend provides an intuitive experience for uploading images and viewing search results.

### 🔌 REST API

The backend exposes a FastAPI-based REST interface with automatic interactive documentation.

---

# 🧠 How It Works

The complete pipeline can be represented as:

```text
┌────────────────┐
│  Photo Upload  │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Face Detection │
│  InsightFace   │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│    Feature     │
│   Embedding    │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  FAISS Index   │
│ Vector Storage │
└───────┬────────┘
        │
        │
        │       Search Request
        │            │
        │            ▼
        │      ┌──────────────┐
        │      │ Query Face   │
        │      └──────┬───────┘
        │             │
        │             ▼
        │      ┌──────────────┐
        └─────▶│   Similarity │
               │    Search    │
               └──────┬───────┘
                      │
                      ▼
               ┌──────────────┐
               │   Matching   │
               │    Photos    │
               └──────────────┘
```

### Step 1 — Upload

Users upload one or more images to the application.

### Step 2 — Detect

InsightFace identifies the faces present in each image.

### Step 3 — Generate Embeddings

Each detected face is converted into a numerical representation called a **face embedding**.

### Step 4 — Index

The embeddings are stored inside a FAISS vector index.

### Step 5 — Search

When a reference face is uploaded, its embedding is compared against the stored embeddings.

### Step 6 — Retrieve

The application returns the images with the highest similarity scores.

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │       USER          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      Vite UI        │
                    └──────────┬──────────┘
                               │
                         HTTP / REST
                               │
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI Server   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │ InsightFace │  │   OpenCV    │  │   NumPy     │
       │ Face Model  │  │ Processing  │  │ Computation │
       └──────┬──────┘  └─────────────┘  └─────────────┘
              │
              ▼
       ┌─────────────┐
       │  Embeddings │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │    FAISS    │
       │ Vector Index│
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │   Matched   │
       │   Images    │
       └─────────────┘
```

---

# 🛠️ Tech Stack

| Layer                   | Technologies                                           |
| ----------------------- | ------------------------------------------------------ |
| **Frontend**            | React, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend**             | Python, FastAPI                                        |
| **Computer Vision**     | OpenCV                                                 |
| **AI / ML**             | InsightFace, ONNX Runtime                              |
| **Vector Search**       | FAISS                                                  |
| **Numerical Computing** | NumPy                                                  |
| **API Documentation**   | FastAPI / Swagger UI                                   |

---

# 📂 Project Structure

```text
Face-search-AI/
│
├── backend/
│   ├── ...
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── ...
│   ├── package.json
│   └── vite.config.*
│
├── main.py
├── README.md
└── LICENSE
```

---

# ⚙️ Installation

## Prerequisites

Make sure the following are installed:

* Python **3.10+**
* Node.js **18+**
* npm
* Git
* Approximately **2GB+** available storage for model files

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Anusri-Biatinty/Face-search-AI.git

cd Face-search-AI
```

---

## 2️⃣ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it.

### macOS / Linux

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your environment configuration:

```bash
cp .env.example .env
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

## 3️⃣ Frontend Setup

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔧 Configuration

Backend configuration is stored in:

```text
backend/.env
```

| Variable               | Purpose                        | Default              |
| ---------------------- | ------------------------------ | -------------------- |
| `MODEL_NAME`           | InsightFace model pack         | `buffalo_l`          |
| `SIMILARITY_THRESHOLD` | Minimum similarity for a match | `0.5`                |
| `DATA_DIR`             | Image storage directory        | `./data`             |
| `INDEX_PATH`           | FAISS index location           | `./data/faiss.index` |
| `MAX_UPLOAD_SIZE_MB`   | Maximum upload size            | `50`                 |

---

# 🔌 API

| Method   | Endpoint  | Purpose                       |
| -------- | --------- | ----------------------------- |
| `POST`   | `/upload` | Upload and index images       |
| `POST`   | `/search` | Search using a reference face |
| `GET`    | `/health` | Check server status           |
| `DELETE` | `/reset`  | Clear indexed data            |

### Example Search

```bash
curl -X POST http://localhost:8000/search \
  -F "file=@query_face.jpg"
```

Example response:

```json
{
  "matches": [
    {
      "image_id": "img_042",
      "similarity": 0.87,
      "url": "/data/img_042.jpg"
    },
    {
      "image_id": "img_118",
      "similarity": 0.81,
      "url": "/data/img_118.jpg"
    }
  ]
}
```

---

# 📊 Similarity Search

The system compares facial embeddings using vector similarity.

Conceptually:

```text
Reference Image
       │
       ▼
Face Detection
       │
       ▼
Face Embedding
       │
       ▼
┌─────────────────────────┐
│     FAISS Search        │
│                         │
│ Compare against indexed │
│ face embeddings         │
└────────────┬────────────┘
             │
             ▼
       Similarity Score
             │
       ┌─────┴─────┐
       │           │
    High Match   Low Match
       │           │
       ▼           ▼
   Return Image   Ignore
```

The configured similarity threshold determines which results are considered matches.

---

# 🔐 Responsible AI & Privacy

Facial recognition technology involves significant privacy considerations.

This project is intended for **consensual and personal use**, such as:

* Personal photo organization
* Family photo archives
* Event galleries with permission
* Educational experimentation
* Computer-vision research

Users should not use the system to identify or track individuals without appropriate knowledge, consent, authorization, or legal basis.

Always consider applicable privacy regulations before deploying facial-recognition systems with real-world personal data.

---

# 🗺️ Roadmap

### 🔐 Security

* [ ] User authentication
* [ ] API keys
* [ ] Role-based access
* [ ] Secure image handling

### ☁️ Infrastructure

* [ ] Cloud storage
* [ ] Docker deployment
* [ ] Cloud deployment
* [ ] Kubernetes support

### 🧠 AI Improvements

* [ ] Face clustering
* [ ] Improved ranking
* [ ] Duplicate image detection
* [ ] Video face search

### 🎨 Product Improvements

* [ ] Advanced search filters
* [ ] Search history
* [ ] User galleries
* [ ] Improved result visualization
* [ ] Batch search

---

# 💡 Future Vision

The long-term goal of **Face Search AI** is to evolve from a simple face-search prototype into a complete **AI-powered personal photo intelligence platform**.

```text
                 Face Search AI
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
   Face Search    Smart Gallery    AI Clustering
       │               │               │
       └───────────────┼───────────────┘
                       │
                       ▼
              Intelligent Photos
```

---

# 👩‍💻 Author

<div align="center">

### **Anusri Biatinty**

Computer Science Engineering Student

Built with Python, React, Computer Vision & AI.

<br/>

⭐ **If you find this project useful, consider starring the repository.**

</div>

---

<div align="center">

**Face Search AI**
*Turning photo collections into searchable visual data.*

</div>
