# 🎯 TRAFFIC AI - OFFLINE CCTV ANALYSIS SERVICE
## Complete Technical Documentation & Frontend Integration Guide

---

## Table of Contents
1. [Service Purpose](#service-purpose)
2. [Architecture Overview](#architecture-overview)
3. [API Endpoints](#-api-endpoints)
4. [Output Files & Formats](#-output-files--formats)
5. [Configuration](#%EF%B8%8F-configuration)
6. [Complete Workflow](#-complete-workflow-frame-by-frame)
7. [Frontend Integration Checklist](#-frontend-integration-checklist)
8. [Key Workflow Details](#-key-workflow-details-for-frontend)
9. [Optional Features](#-optional-features-toggleable)
10. [Important Limitations](#-important-limitations--notes)
11. [Summary](#-summary-for-frontend-dev)

---

## Service Purpose

Traffic AI is an **offline CCTV pipeline** for automated traffic violation and accident detection. It processes video/image files from camera feeds and generates:
- **Detailed incident reports** (FIR documents)
- **Violation logs** (CSV with violations per vehicle)
- **Forensic evidence** (snapshots, annotated videos)
- **Investigator support** (optional AI reasoning)

Perfect for traffic enforcement, accident investigation, and surveillance management centers.

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                 FASTAPI SERVER (app/main.py)                    │
│                    Port 8000 - CORS Enabled                     │
└──────────────────────────┬──────────────────────────────────────┘
          │
          ├─── Health Router (routes_health.py)
          │
          ├─── Upload Router (routes_upload.py)
          │         └─> Video/Image Processing Pipeline
          │
          ├─── Runs Router (routes_runs.py)
          │         └─> Status Registry
          │
          └─── Download Router (routes_download.py)
                    └─> File Retrieval
```

### Processing Flow (Per Video/Image)

```
┌──────────────────────────────────────────────────────────────┐
│ 1. VEHICLE TRACKING (YOLOv8n)                                │
│    ↓ Detects: person, bicycle, car, motorcycle, bus, truck  │
├──────────────────────────────────────────────────────────────┤
│ 2. ACCIDENT DETECTION (Custom YOLOv8 - epoch14.pt)          │
│    ↓ Runs every 3 frames, confirms with temporal voting      │
├──────────────────────────────────────────────────────────────┤
│ 3. INCIDENT MANAGER                                          │
│    ↓ Associates accident boxes with tracked vehicles         │
│    ↓ Confirms accident if 3+ frames w/ detections in 3 sec  │
├──────────────────────────────────────────────────────────────┤
│ 4. HELMET DETECTION (best.pt)                                │
│    ↓ Runs every 5 frames on motorcycle upper-body ROI        │
│    ↓ Votes on 9 frames to determine helmet presence          │
├──────────────────────────────────────────────────────────────┤
│ 5. VIOLATION LOGGING (CSV)                                   │
│    ↓ Logs all vehicles: speed, helmet, accidents, etc.       │
├──────────────────────────────────────────────────────────────┤
│ 6. ANNOTATION & SNAPSHOTS                                    │
│    ↓ Green boxes = normal, RED boxes = accident vehicles     │
│    ↓ Snapshots every 2 sec if accident confirmed             │
├──────────────────────────────────────────────────────────────┤
│ 7. OPTIONAL: FIR GENERATION + POLISHING                      │
│    ↓ Ollama LLM polishes formal language (if enabled)        │
├──────────────────────────────────────────────────────────────┤
│ 8. OPTIONAL: COSMOS REASONING                                │
│    ↓ AI provides investigator analysis notes (if enabled)    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### 1. Health Check

```http
GET /
```

**Response:**
```json
{
  "status": "running"
}
```

**Purpose:** Verify backend is online

---

### 2. Upload & Analyze Video/Image

```http
POST /analyze/upload
Content-Type: multipart/form-data
```

**Input:**
- `file`: Video (`.mp4`, `.avi`, `.mov`, `.mkv`, `.webm`, `.mpg`, `.mpeg`, `.mjpeg`)
- OR Image (`.jpg`, `.jpeg`, `.png`)

**Response (Synchronous - waits for full processing):**
```json
{
  "run_id": "a1b2c3d4e",
  "status": "done",
  "outputs": {
    "annotated_video": "app/outputs/a1b2c3d4e/annotated.mp4",
    "violations_csv": "app/outputs/a1b2c3d4e/violations.csv",
    "snapshots_dir": "app/outputs/a1b2c3d4e/snapshots/",
    "fir_txt": "app/outputs/a1b2c3d4e/fir.txt",
    "cosmos_txt": "app/outputs/a1b2c3d4e/cosmos_analysis.txt",
    "fir_preview": "On examination of the CCTV footage...",
    "cosmos_preview": "..."
  }
}
```

**Error Codes:**
- `400`: Unsupported file format
- `500`: Processing error

**Important Notes:**
- Processing is **SYNCHRONOUS** (blocks until completion)
- Large videos (10+ minutes) may take minutes to process
- Frontend should use appropriate timeout values (30-60 seconds)

---

### 3. Get Run Status & Metadata

```http
GET /runs/{run_id}
```

**Response:**
```json
{
  "run_id": "a1b2c3d4e",
  "status": "done",
  "input_path": "app/outputs/a1b2c3d4e/video.mp4",
  "run_dir": "app/outputs/a1b2c3d4e",
  "message": "",
  "outputs": { }
}
```

**Error:** `404` if run_id doesn't exist

---

### 4. Download Any Generated File

```http
GET /runs/{run_id}/file/{filename}
```

**Examples:**
```
GET /runs/a1b2c3d4e/file/annotated.mp4
GET /runs/a1b2c3d4e/file/violations.csv
GET /runs/a1b2c3d4e/file/snapshots/accident_frame123_t45.67.jpg
GET /runs/a1b2c3d4e/file/fir.txt
GET /runs/a1b2c3d4e/file/cosmos_analysis.txt
```

**Response:** File binary (video/csv/image/text)

**Error:** `404` if file doesn't exist

---

## 📤 Output Files & Formats

All outputs stored in: `app/outputs/{run_id}/`

### 1. annotated.mp4 (or annotated.jpg for images)

**Description:** Input video with bounding boxes and labels

**Visual Annotations:**
- 🟢 **GREEN boxes** = Normal tracked vehicle
- 🔴 **RED boxes** = Vehicle involved in accident
- **Green label**: `{class} id={track_id} {speed_kmph}km/h`
- **Red text** (accident): `ACCIDENT 0.95` (confidence score)

**File Size:** Same or slightly larger than input (recompressed)

---

### 2. violations.csv

**Description:** Complete violation log for all detected vehicles

**Schema (15 columns):**
```
camera_id | frame_id | timestamp | lane | speed_kmph | overspeed | label | 
confidence | color | helmet_violation | weapon_detected | fight_detected | 
fight_confidence | violation_type | violation_image
```

**Violation Types:**
- `accident` - Vehicle involved in detected accident
- `helmet` - Motorcycle rider without helmet
- `overspeed` - Vehicle exceeding speed limit
- `weapon` - Weapon detected (not yet wired)
- `fight` - Fight detected (not yet wired)
- `normal` - No violation

**Example Row:**
```csv
CAM_01,150,6.00,1,75.50,true,car,0.90,unknown,false,false,false,0.00,accident,snapshots/accident_frame150_t6.00.jpg
CAM_01,150,6.00,1,95.20,true,motorcycle,0.90,unknown,true,false,false,0.00,helmet,snapshots/accident_frame150_t6.00.jpg
```

**Column Details:**
| Column | Type | Description |
|--------|------|-------------|
| camera_id | string | Camera identifier (default: CAM_01) |
| frame_id | int | Frame number in video |
| timestamp | float | Time in seconds (2 decimal places) |
| lane | int | Lane number (placeholder: always 1) |
| speed_kmph | float | Speed in km/h |
| overspeed | bool | Exceeds SPEED_LIMIT? |
| label | string | Vehicle class (car, motorcycle, etc.) |
| confidence | float | Detection confidence (0.0-1.0) |
| color | string | Vehicle color (placeholder: always unknown) |
| helmet_violation | bool | No helmet detected? |
| weapon_detected | bool | Weapon detected? |
| fight_detected | bool | Fight detected? |
| fight_confidence | float | Fight confidence score |
| violation_type | string | Primary violation category |
| violation_image | string | Path to snapshot (if applicable) |

---

### 3. snapshots/ (folder)

**Description:** Evidence images captured during accidents

**Naming Convention:** `accident_frame{frame_id}_t{timestamp}.jpg`

**Example:** `accident_frame150_t6.00.jpg`

**Contents:** 
- Annotated frames with bounding boxes and labels
- Same visual style as `annotated.mp4`

**Capture Logic:**
- Only saved if accident **CONFIRMED**
- Cooldown: One per 2 seconds (configurable)
- Limited number per incident (typically 5-15 frames)

---

### 4. fir.txt (FIR = First Information Report)

**Description:** Formal written incident report (legal document suitable for police filing)

**When Generated:** 
- ONLY if accident is **CONFIRMED** (3+ detections in 3-sec window)
- Empty filename returned if no accident

**Content Structure:**
```
On examination of the CCTV footage, an incident of road traffic accident 
was observed between approximately {start_time} seconds and {end_time} seconds 
in the said footage. The vehicles involved in the occurrence were identified 
in the footage as tracked objects bearing Track IDs {involved_track_ids}. 
The sequence and exact manner of occurrence require verification from the 
scene, witnesses, and additional footage, if any.

[Optional] Further, in the said footage, a motorcycle rider involved in 
the accident appears to be without a safety helmet, subject to verification 
due to camera angle/clarity.
```

**Processing Pipeline:**
1. ✅ Generated from accident facts
2. ✅ Polished by Ollama LLM (if `ENABLE_OLLAMA_POLISH=True`)
3. ✅ Saved to file
4. ✅ Preview returned in API response

**Characteristics:**
- Formal, factual language suitable for legal proceedings
- No guilt or fault assignment
- All claims supported by video analysis
- Structured for Indian police format requirements

---

### 5. cosmos_analysis.txt (Optional - requires NVIDIA Cosmos)

**Description:** AI-generated investigator reasoning and scene analysis

**When Generated:**
- ONLY if `ENABLE_COSMOS_REASONING=True` in config
- ONLY if accident is **CONFIRMED**
- Empty if Cosmos service unavailable

**Content Sections:**
1. **Sequence of Events** - Timeline of incident
2. **Observed Risks** - Safety violations and hazards noted
3. **Points Needing Verification** - Areas for further investigation

**Key Characteristics:**
- ✅ Neutral analysis (does NOT assign guilt or fault)
- ✅ Supportive for investigators
- ✅ Evidence-based observations
- ✅ Highlights areas requiring human judgment

**Example Content:**
```
1. Sequence of Events:
   - At t=5.50s, motorcycle (ID 5) accelerated toward vehicle (ID 2)
   - At t=6.00s, collision detected by model
   - At t=8.50s, vehicles separated

2. Observed Risks:
   - Motorcycle speed: 95 km/h (exceeds 60 km/h limit)
   - Rider appears without helmet (high injury risk)
   - Weather conditions: unclear from footage

3. Points Needing Verification:
   - Exact impact force (requires second camera angle)
   - Rider identity confirmation
   - Vehicle maintenance records
```

---

## ⚙️ Configuration

All settings in: `app/utils/config.py`

### Critical Settings for Frontend Integration

| Setting | Default | Purpose | Frontend Impact |
|---------|---------|---------|-----------------|
| `SPEED_LIMIT` | 60 km/h | Overspeed detection threshold | Affects overspeed flagging in CSV |
| `SAVE_SNAPSHOTS` | True | Enable snapshot capture | Determines if violation_image populated |
| `SNAP_COOLDOWN_SEC` | 2.0 | Min seconds between snapshots | Controls snapshot frequency |
| `ACC_EVERY_N_FRAMES` | 3 | Accident detection frequency | 1 in every 3 frames checked |
| `HELMET_EVERY_N_FRAMES` | 5 | Helmet detection frequency | 1 in every 5 frames for motorcycles |
| `HELMET_VOTE_FRAMES` | 9 | Frames to vote on helmet | Requires 5-9 detections for final decision |
| `ACC_PERSIST_FRAMES` | 3 | Frames to confirm accident | Must have 3+ detections in 3-sec window |
| `ACC_WINDOW_SEC` | 3.0 | Time window for voting | Window for accident temporal logic |
| `ENABLE_OLLAMA_POLISH` | False | LLM FIR polishing? | Controls FIR text enhancement |
| `ENABLE_COSMOS_REASONING` | False | Cosmos reasoning? | Enables/disables cosmos_analysis.txt |

### Models & Paths

| Model Type | File | Purpose | Detection Target |
|-----------|------|---------|------------------|
| Tracking | `yolov8n.pt` | Vehicle detection & tracking | person, bicycle, car, motorcycle, bus, truck |
| Accident | `epoch14.pt` | Accident detection (custom) | Accident regions in CCTV |
| Helmet | `best.pt` | Helmet classification (binary) | With Helmet (0) / Without Helmet (1) |
| Weapons | `All_weapon.pt` | Weapon detection (optional) | Weapons in scene (NOT YET WIRED) |

### Performance & Calibration

```python
# Speed Estimation
PIXEL_TO_METER = 0.05  # camera-dependent (requires calibration)

# Accident Detector (optimized for CCTV)
ACC_CONF = 0.35          # Lower = more detections
ACC_IOU_NMS = 0.50       # NMS threshold
ACC_IMGSZ = 960          # Higher = better for distant CCTV
ACC_MAX_DET = 200        # Max detections per frame

# Tracking
TRACK_CONF = 0.35        # Detection confidence threshold
TRACK_CLASSES = [0, 1, 2, 3, 5, 7]  # COCO class IDs

# Association (accident box → vehicle track)
ACC_ASSOC_TOPK = 2                    # Top 2 vehicles per accident
ACC_ASSOC_IOU_MIN = 0.05              # Loose IoU match (CCTV-friendly)
ACC_ASSOC_CENTER_MAX_PX = 350         # Max distance (pixels)
```

### Optional LLM Services

**Ollama (FIR Polishing):**
```python
ENABLE_OLLAMA_POLISH = False
OLLAMA_URL = "http://ollama-sales.mobiusdtaas.ai/api/generate"
OLLAMA_MODEL = "llama3.2:latest"
OLLAMA_TEMPERATURE = 0.1
```

**Cosmos (Investigator Support):**
```python
ENABLE_COSMOS_REASONING = False
COSMOS_URL = "http://localhost:8000/v1/generate"
COSMOS_MODEL = "nvidia/cosmos-reason1-7b"
COSMOS_TEMPERATURE = 0.1
```

---

## 🔄 Complete Workflow (Frame-by-Frame)

### Per-Frame Pipeline Detail

```
Frame N (e.g., frame 150, timestamp 6.00 sec, FPS=25):

┌─────────────────────────────────────────────────────────┐
│ 1️⃣  TRACKING (Every frame)                              │
├─────────────────────────────────────────────────────────┤
│  └─> Model: YOLOv8n.track() with persistence             │
│  └─> Input: Full frame                                  │
│  └─> Output: tracks = [                                 │
│       {                                                  │
│         track_id: 2,                                     │
│         class: "car",                                    │
│         class_id: 2,                                     │
│         bbox: [100, 200, 300, 400],  # [x1,y1,x2,y2]   │
│         speed_kmph: 75.5                                │
│       },                                                 │
│       {                                                  │
│         track_id: 5,                                     │
│         class: "motorcycle",                             │
│         class_id: 3,                                     │
│         bbox: [400, 150, 480, 350],                      │
│         speed_kmph: 95.2                                │
│       }                                                  │
│     ]                                                    │
│  └─> Speed calculation: distance * PIXEL_TO_METER * 3.6 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 2️⃣  ACCIDENT DETECTION (Every 3rd frame)                │
├─────────────────────────────────────────────────────────┤
│  IF frame_id % 3 == 0:                                   │
│  └─> Model: epoch14.pt (accident-specific)              │
│  └─> Input: Full frame                                  │
│  └─> Output:                                            │
│      acc_boxes = [[50, 100, 350, 450]],  # bounding box │
│      acc_confs = [0.92]                   # confidence  │
│  ELSE:                                                   │
│  └─> acc_boxes = [], acc_confs = []  (no inference)     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 3️⃣  INCIDENT MANAGER (Every frame)                      │
├─────────────────────────────────────────────────────────┤
│  a) Associate accident boxes with tracked vehicles       │
│     └─> For each acc_box:                               │
│        └─> Find closest 2 tracks (by IoU + center dist) │
│        └─> Store association with score                 │
│                                                          │
│  b) Temporal voting (3-sec sliding window)               │
│     └─> Keep detections from last 3 seconds             │
│     └─> Count frames with ≥1 accident detection         │
│     └─> IF count ≥ 3: confirmed_accident = True         │
│                                                          │
│  c) Update state:                                        │
│     └─> State: {                                        │
│          confirmed_accident: true,                       │
│          accident_start_sec: 5.50,                       │
│          accident_end_sec: 6.00,                         │
│          involved_track_ids: [2, 5],                     │
│          involved_tracks_meta: [...]                     │
│        }                                                 │
│     └─> red_ids = [2, 5]  (for RED annotation)          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 4️⃣  HELMET DETECTION (Every 5th frame, motorcycles only)│
├─────────────────────────────────────────────────────────┤
│  IF frame_id % 5 == 0:                                   │
│    FOR each track:                                       │
│      IF track.class == "motorcycle":                     │
│        a) Extract upper-body ROI                         │
│           └─> Crop: upper 55% of motorcycle bbox        │
│           └─> Add padding: ±10% width, ±8% height       │
│           └─> Clamp to frame boundaries                 │
│                                                          │
│        b) Helmet model inference                         │
│           └─> Model: best.pt on ROI crop                │
│           └─> Output: class 0=With, class 1=Without     │
│           └─> Confidence: float 0.0-1.0                 │
│                                                          │
│        c) Vote accumulation                              │
│           └─> Store result in helmet_track_votes[tid]    │
│           └─> Keep last 9 votes                          │
│           └─> Example: [True, True, False, True, ...]    │
│                                                          │
│  d) Final determination (only for confirmed accidents)   │
│     IF confirmed_accident AND motorcycles involved:      │
│       └─> Majority vote over 9 frames                    │
│       └─> If majority=False: motorcycle_no_helmet_final │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 5️⃣  CSV LOGGING (For each vehicle in frame)             │
├─────────────────────────────────────────────────────────┤
│  FOR each track in tracks:                               │
│    a) Determine violation type                           │
│       └─> IF involved_in_accident: "accident"            │
│       └─> ELIF weapon_detected: "weapon"                 │
│       └─> ELIF fight_detected: "fight"                   │
│       └─> ELIF helmet_violation: "helmet"                │
│       └─> ELIF overspeed: "overspeed"                    │
│       └─> ELSE: "normal"                                 │
│                                                          │
│    b) Snapshot path (if applicable)                      │
│       └─> IF accident AND >2s since last snap:          │
│           └─> snap_name = f"accident_frame{id}_t{ts}.jpg"│
│       └─> ELSE: snap_name = ""                           │
│                                                          │
│    c) Log to CSV:                                        │
│       CAM_01,150,6.00,1,75.50,true,car,0.90,unknown,    │
│       false,false,false,0.00,accident,snapshots/...      │
│                                                          │
│    d) Log second vehicle (motorcycle):                   │
│       CAM_01,150,6.00,1,95.20,true,motorcycle,0.90,     │
│       unknown,true,false,false,0.00,helmet,snapshots/...│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 6️⃣  ANNOTATION (Every frame)                            │
├─────────────────────────────────────────────────────────┤
│  a) Draw vehicle bounding boxes                          │
│     FOR each track:                                      │
│       IF track_id in red_ids:                            │
│         └─> Color: RED (involved in accident)            │
│       ELSE:                                              │
│         └─> Color: GREEN (normal)                        │
│       └─> Draw rectangle with 2px width                  │
│       └─> Add label: "{class} id={tid} {speed}km/h"      │
│                                                          │
│  b) Draw accident boxes (if detections this frame)       │
│     FOR each accident detection:                         │
│       └─> Color: RED                                     │
│       └─> Confidence label: "ACCIDENT 0.92"              │
│                                                          │
│  c) Output: annotated frame ready for video writer       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 7️⃣  SNAPSHOTS (Only if accident confirmed)              │
├─────────────────────────────────────────────────────────┤
│  IF confirmed_accident AND (now - last_snapshot) > 2sec: │
│    └─> Save annotated frame to:                          │
│        app/outputs/{run_id}/snapshots/accident_frame150_ │
│        t6.00.jpg                                         │
│    └─> Update last_snap_frame = frame_id                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 8️⃣  VIDEO WRITE (Every frame)                           │
├─────────────────────────────────────────────────────────┤
│  └─> Write annotated frame to MP4 at original FPS        │
│  └─> Maintains video quality/codec                       │
└─────────────────────────────────────────────────────────┘
```

### End-of-Video Processing

```
After last frame processed:

┌──────────────────────────────────────────────────────┐
│ 1. FINALIZE VIDEO                                    │
├──────────────────────────────────────────────────────┤
│   └─> Release video capture & writer
│   └─> Close CSV file
│   └─> Free memory
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ 2. FIR GENERATION (If accident confirmed)            │
├──────────────────────────────────────────────────────┤
│   IF incidents.state.confirmed_accident == True:     │
│     └─> Build report dict:                           │
│        {                                             │
│          "run_id": "a1b2c3d4e",                      │
│          "event_type": "road_traffic_accident",      │
│          "start_time_sec": 5.50,                     │
│          "end_time_sec": 8.50,                       │
│          "involved_track_ids": [2, 5],               │
│          "involved_tracks_meta": [...],              │
│          "motorcycle_no_helmet": true                │
│        }                                             │
│     └─> Generate FIR text (facts-based)             │
│     └─> Optional: Polish with Ollama LLM            │
│     └─> Save to: fir.txt                            │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ 3. COSMOS REASONING (If accident + enabled)         │
├──────────────────────────────────────────────────────┤
│   IF ENABLE_COSMOS_REASONING == True:                │
│     └─> Prepare scene facts (from report)            │
│     └─> Send to Cosmos API for analysis             │
│     └─> Receive: sequence, risks, verification pts │
│     └─> Save to: cosmos_analysis.txt                │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ 4. PREPARE OUTPUT RESPONSE                           │
├──────────────────────────────────────────────────────┤
│   Return outputs dict with:                          │
│   - All file paths                                  │
│   - Text previews (first 800 chars)                 │
│   - Status indicators                               │
└──────────────────────────────────────────────────────┘
```

---

## 📋 Frontend Integration Checklist

### File Upload Form HTML/React

```html
<!-- HTML Form -->
<form enctype="multipart/form-data" action="/analyze/upload" method="POST">
  <input type="file" name="file" 
         accept=".mp4,.avi,.mov,.mkv,.webm,.jpg,.jpeg,.png" 
         required />
  <button type="submit">Analyze</button>
</form>

<!-- React Component -->
const [file, setFile] = useState(null);
const [loading, setLoading] = useState(false);

const handleUpload = async () => {
  const formData = new FormData();
  formData.append('file', file);
  
  setLoading(true);
  try {
    const response = await fetch('/analyze/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    // Handle response...
  } finally {
    setLoading(false);
  }
};
```

### Progress Handling

**⚠️ CRITICAL:**
- Uploads are **SYNCHRONOUS** (NOT async/background)
- Large videos block until completion
- Typical timing:
  - 5-minute video: 1-2 minutes processing
  - 30-minute video: 10-15 minutes processing
- **Frontend must handle:**
  - Timeout values: 30-60 seconds minimum
  - Spinner/progress feedback
  - Disable interaction during upload
  - Error fallback with retry logic

**Recommended Approach:**
```javascript
// Option 1: Long-running request with extended timeout
const uploadWithTimeout = async (file) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5*60*1000); // 5 min
  
  try {
    const response = await fetch('/analyze/upload', {
      method: 'POST',
      body: new FormData(file),
      signal: controller.signal
    });
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

// Option 2: Background job queue (future enhancement)
// POST /analyze/queue → returns job_id
// GET /analyze/status/{job_id} → poll for completion
```

### Display Results

**Video Player:**
```html
<video controls width="100%">
  <source src="/runs/{run_id}/file/annotated.mp4" type="video/mp4">
</video>
```

**CSV Table:**
```javascript
const parseCSV = (csvText) => {
  // Use: Papa Parse, csv-parse, or built-in
  const rows = Papa.parse(csvText, { header: true }).data;
  return rows.filter(r => r.violation_type !== 'normal');
};
```

**Snapshot Gallery:**
```javascript
const snapshots = [];
// List files in: /runs/{run_id}/file/snapshots/
// Display as grid with click-to-expand
```

**Text Modals:**
```javascript
// Show FIR in modal/drawer
const fir = await fetch(`/runs/${run_id}/file/fir.txt`);
const firText = await fir.text();
showModal('FIR Report', firText);
```

### Error Handling

```javascript
const handleError = (error) => {
  if (error.status === 400) {
    showError('Invalid file format. Supported: MP4, JPG, etc.');
  } else if (error.status === 404) {
    showError('Run ID not found. Please re-upload.');
  } else if (error.status === 500) {
    showError('Processing error. Check file and retry.');
  } else if (error.name === 'AbortError') {
    showError('Upload timeout. File too large?');
  } else {
    showError('Unknown error. Check network.');
  }
};
```

---

## 💡 Key Workflow Details for Frontend

### What Triggers an Accident Report?

**Step 1: Detection Phase**
- Accident detector runs every 3 frames
- Produces bounding box(es) marking accident region

**Step 2: Association Phase**
- Each accident box associated with tracked vehicles
- Nearest 2 vehicles flagged as "involved"

**Step 3: Confirmation Phase (Temporal Voting)**
- Collect detections in 3-second rolling window
- If ≥3 frames have detections → **ACCIDENT CONFIRMED**
- Only then: FIR generated, snapshots saved, involved vehicles marked RED

**Timeline Example:**
```
t=5.50s: First detection → count=1
t=6.00s: Detection → count=2
t=6.50s: Detection → count=3 ✅ CONFIRMED
t=7.00s: NO detection
t=7.50s: Detection → count=4 (newer window)
...continues until no detections for 3 seconds...
t=8.50s: Last detection found → accident_end_sec=8.50
```

### What Determines Helmet Violation?

**Criteria:**
1. Vehicle must be classified as **motorcycle**
2. Must have ≥5 helmet detections (out of every 5 frames)
3. Majority vote determines final state

**Voting Logic:**
```
Helmet detection runs every 5 frames on motorcycle:

Frame 150: Helmet detector → Without helmet (False)
Frame 155: Skip (not every 5)
Frame 160: Helmet detector → Without helmet (False)
Frame 165: Helmet detector → With helmet (True)
...

After 9-frame window:
Votes: [False, False, True, False, False, True, False, False, True]
Count: 3 True, 6 False
Majority: False → HELMET VIOLATION FLAGGED ❌
```

### Video Annotation Guide

**Track Colors:**
- 🟢 **GREEN**: Normal vehicle, can proceed freely
- 🔴 **RED**: Involved in accident, emergency response

**Label Format:**
```
[Class] id=[Track_ID] [Speed]km/h

Examples:
  car id=2 75.5km/h        (GREEN)           
  motorcycle id=5 95.2km/h (RED - in accident)
```

**Accident Box Format:**
```
ACCIDENT [Confidence]

Examples:
  ACCIDENT 0.92  (high confidence)
  ACCIDENT 0.45  (low confidence, may be false positive)
```

### Speed Calculation Method

**Per-Frame Speed:**
1. Get track center: `(cx, cy) = center_of_bbox(track.bbox)`
2. Compare with previous frame position
3. Calculate pixel distance: `dist_px = sqrt((cx-px)² + (cy-py)²)`
4. Convert to meters: `dist_m = dist_px * PIXEL_TO_METER` (0.05 default)
5. Calculate velocity: `v = dist_m / delta_t_sec`
6. Convert to km/h: `speed_kmph = v * 3.6`

**Calibration Note:**
- `PIXEL_TO_METER` is camera-dependent
- Requires real-world reference (e.g., known distance in scene)
- Default (0.05) is rough estimate for mid-height CCTV
- Adjust based on camera mounting height/angle

---

## 🚀 Optional Features (Toggleable)

### 1. Ollama LLM Polishing (FIR Enhancement)

**Configuration:**
```python
ENABLE_OLLAMA_POLISH = True/False
OLLAMA_URL = "http://ollama-endpoint/api/generate"
OLLAMA_MODEL = "llama3.2:latest"
OLLAMA_TEMPERATURE = 0.1
```

**Workflow:**
```
Generated FIR:
  "On examination of the CCTV footage, an incident of road traffic 
   accident was observed between approximately 5.50 seconds and 8.50 
   seconds in the said footage..."

↓ Sent to Ollama with prompt:
  "Rewrite in formal Indian police language. One paragraph only."

↓ Polished FIR:
  "Upon meticulous examination of the aforesaid CCTV footage, an 
   incident constituting a road traffic accident was brought to 
   observation between the temporal markers of approximately 5.50 
   seconds and 8.50 seconds..."
```

**Benefits:**
- ✅ Enhanced legal/formal language
- ✅ Consistent tone across reports
- ✅ Better readability for police

**Impact on Frontend:**
- Delays FIR generation by ~5-10 seconds
- `fir_preview` shows polished version
- No impact on video/CSV processing

### 2. Cosmos Reasoning (Investigator Support)

**Configuration:**
```python
ENABLE_COSMOS_REASONING = True/False
COSMOS_URL = "http://cosmos-endpoint/v1/generate"
COSMOS_MODEL = "nvidia/cosmos-reason1-7b"
COSMOS_TEMPERATURE = 0.1
```

**Input to Cosmos:**
```
Incident type: accident
Time window in footage (seconds): 5.50 to 8.50
Involved tracked objects (Track IDs): [2, 5]
Involved track metadata: [vehicle 2=car, vehicle 5=motorcycle]
Observation: A motorcycle rider involved appears to be without helmet.
```

**Output from Cosmos:**
```
1. Sequence of Events:
   - At t=5.50s, motorcycle accelerated in lane 1
   - At t=6.00s, collision detected between car and motorcycle
   - At t=8.50s, vehicles separated and stopped

2. Observed Risks:
   - Motorcycle speed exceeded limit (95 km/h vs 60)
   - Rider not wearing safety helmet (protects in collision)
   - Impact location on motorcycle right side

3. Points Needing Verification:
   - Was motorcycle braking before collision?
   - Car driver's reaction time
   - Visibility conditions at incident time
   - Medical status of accident victims
```

**Benefits:**
- ✅ Supports human investigators
- ✅ Identifies verification gaps
- ✅ Neutral, evidence-based analysis
- ✅ Reduces investigation time

**Impact on Frontend:**
- Available in separate `cosmos_analysis.txt`
- Show in dedicated analysis section
- Complements FIR report

---

## ⚠️ Important Limitations & Notes

### 1. Single-Process Architecture

**Current Design:**
```python
RUN_REGISTRY = {}  # In-memory dict
```

**Limitation:**
- Store runs in RAM (lost on server restart)
- Works for single server instance only

**Production Recommendation:**
```python
# Switch to Redis/Database
import redis
cache = redis.Redis(host='localhost', port=6379)
cache.set(f"run:{run_id}", json.dumps(run_data))
```

**Frontend Impact:**
- Advise users to download results immediately
- No historical run lookup after server restart

### 2. Synchronous Processing

**Current Behavior:**
```
POST /analyze/upload
  ↓ (blocks server)
  Processing video (10+ minutes for large files)
  ↓
Response after completion
```

**Limitation:**
- Ties up server thread during processing
- Large videos may timeout (HTTP timeout ~30 sec)
- No progress updates during processing

**Recommended Workaround:**
```javascript
// Long-running request pattern
const uploadLarge = async (file) => {
  // Use fetch with extended timeout
  const promise = fetch('/analyze/upload', {
    method: 'POST',
    body: new FormData(file)
  });
  
  // Show spinner/progress
  // Retry on timeout error
  // Implement exponential backoff
};
```

**Future Enhancement:**
- Implement async job queue (Celery/RQ)
- Return `job_id` immediately
- Poll `/analyze/status/{job_id}` for progress
- Use WebSocket for real-time updates

### 3. Weapon & Fight Detection (Not Wired)

**Current Status:**
- Models exist: `All_weapon.pt`
- Code placeholder exists (columns in CSV)
- Inference NOT integrated in pipeline

**In Code:**
```python
weapon_detected = False  # Always False
fight_detected = False   # Always False
fight_confidence = 0.0   # Always 0.0
```

**CSV Shows:**
```
weapon_detected | fight_detected | fight_confidence
false           | false          | 0.00  (always)
```

**Frontend Note:**
- Don't rely on these fields yet
- Plan UI for future feature
- May be activated in future version

### 4. Speed Estimation Accuracy

**Issues:**
- Calibration constant (PIXEL_TO_METER) is rough
- Camera angle/height greatly affects accuracy
- Distance calc uses straight-line distance, not travelled path

**Real-World Example:**
```
Configured: PIXEL_TO_METER = 0.05

Frame A: Car at pixel (100, 200)
Frame B: Car at pixel (150, 210)

Distance: sqrt((50)² + (10)²) = 50.99 pixels
Real distance: 50.99 * 0.05 = 2.55 meters
Time delta: 40ms (25 FPS)
Speed: 2.55m / 0.04s = 63.75 m/s = 229.5 km/h ❌ WRONG

Actual speed: ~60 km/h (correct)
Error: 3.8x due to calibration
```

**Recommendation:**
- Calibrate per camera installation
- Use known reference distance in scene
- Adjust PIXEL_TO_METER empirically
- Speed output is relative, not absolute

### 5. Helmet Detection Limitations

**Technical Issues:**
- Works best for upright riders (motorcycle vertical)
- Upper-body ROI extraction may fail in extreme angles
- Helmet reflection/lighting can confuse model

**Failure Cases:**
```
✅ Works well:
  - Upright rider, helmet clearly visible
  - Standard CCTV angle

❌ Fails:
  - Rider leaning (motorcycle tilted 45°+)
  - Low light/backlit helmet
  - Helmet partially obscured by rider body
  - Extreme camera angle (side/below angle)
```

**CSV Note:**
```
helmet_violation: true  = "No helmet detected, but verify with video"
helmet_violation: false = "Helmet detected or unclear"
```

### 6. Lane Detection Placeholder

**Current Implementation:**
```python
lane = 1  # Always 1
```

**CSV Column:**
```
lane: 1  (every row)
```

**Future Enhancement:**
- Implement lane detection algorithm
- Update with actual lanes where vehicles detected
- Useful for lane-specific violations

---

## 📝 Summary for Frontend Dev

### What is Traffic AI?

A **video analysis service** that:
1. ✅ Detects vehicles in CCTV footage (tracking + speed)
2. ✅ Detects accidents (temporal voting for confirmation)
3. ✅ Flags helmet violations (for motorcycles)
4. ✅ Generates violation reports (CSV per vehicle)
5. ✅ Creates evidence snapshots (accident frames)
6. ✅ Produces legal FIR documents (optional LLM polish)
7. ✅ Provides investigator reasoning (optional Cosmos AI)

### Frontend Architecture

```
User Interface
    ↓
[File Upload Form]
    ↓
POST /analyze/upload (synchronous, blocks)
    ↓
[Processing Spinner] ⏳ (1-20 minutes)
    ↓
[Results Dashboard]
    ├─ Video Player (annotated.mp4)
    ├─ Violations Table (violations.csv)
    ├─ Snapshots Gallery (snapshots/)
    ├─ FIR Report (fir.txt)
    └─ Analysis Notes (cosmos_analysis.txt)
    ↓
[Download Options]
    └─ GET /runs/{run_id}/file/{filename}
```

### Key Data Flows for Mapping

**1. Upload → Processing → Results:**
```
Frontend                Backend                Output
┌─────────┐           ┌─────────┐            ┌────────┐
│ Select  │           │Process  │────        │Results │
│File    ├──POST───────→Video   │ /outputs/  │Files   │
│Upload  │           │Pipeline │────        │        │
└─────────┘           └─────────┘            └────────┘
                            ↓
                        run_id: "a1b2c3d"
```

**2. Violation Detection:**
```
Tracking      Accident Det    Incident Mgr    CSV Logger
┌──────┐      ┌──────┐        ┌────────┐     ┌────────┐
│Track │      │Detect│        │Confirm │     │Log Row │
│Vehs  ├─────→│Acc   ├───────→│Accident├────→│Every   │
└──────┘      └──────┘        └────────┘     │Vehicle │
                                             └────────┘
                                             (violations.csv)
```

**3. Helmet Voting:**
```
Every 5 frames on motorcycle:
Frame 1: Helmet.infer() → True
Frame 2: Helmet.infer() → False
...
Frame 9: Helmet.infer() → True

Votes: [T, F, T, F, F, F, T, F, F]
Count: 3 True, 6 False
Result: No Helmet ❌ (logged to CSV)
```

**4. FIR Generation Flow:**
```
Incident Confirmed
    ↓
Extract facts (start_time, end_time, involved_ids)
    ↓
Generate facts-based FIR narration
    ↓
[Optional] Polish with Ollama LLM
    ↓
Save to fir.txt
    ↓
Return preview in API response
```

### Frontend Responsibilities

| Task | Implementation |
|------|-----------------|
| File Upload | `<input type="file">` + FormData |
| Progress Feedback | Spinner + status text during processing |
| Timeout Handling | Extend HTTP timeout to 5+ minutes |
| Video Display | `<video>` tag with .mp4 source |
| CSV Parsing | Papa Parse or csv-parse library |
| CSV Filtering | Filter by `violation_type` for display |
| Image Gallery | Thumbnail grid from snapshots/ folder |
| Text Display | Modal/drawer for FIR and Cosmos text |
| Error Handling | HTTP status codes + friendly messages |
| Download Links | GET endpoint for each file type |

### API Integration Summary

```javascript
// Complete flow
async function analyzeVideo(file) {
  // 1. Upload
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/analyze/upload', {
    method: 'POST',
    body: formData,
    timeout: 5*60*1000  // 5 minutes
  });
  
  const { run_id, outputs } = await response.json();
  
  // 2. Get status (optional, data already in response)
  const status = await fetch(`/runs/${run_id}`).then(r => r.json());
  
  // 3. Download files
  const video = await fetch(`/runs/${run_id}/file/annotated.mp4`)
    .then(r => r.blob());
  const csv = await fetch(`/runs/${run_id}/file/violations.csv`)
    .then(r => r.text());
  const fir = await fetch(`/runs/${run_id}/file/fir.txt`)
    .then(r => r.text());
  
  // 4. Display results
  displayVideo(video);
  displayViolations(parseCSV(csv));
  displayFIR(fir);
}
```

---

## Appendix: Example API Payloads

### Upload Request
```bash
curl -X POST "http://localhost:8000/analyze/upload" \
  -F "file=@video.mp4"
```

### Upload Response (Success)
```json
{
  "run_id": "a1b2c3d4e",
  "status": "done",
  "outputs": {
    "annotated_video": "app/outputs/a1b2c3d4e/annotated.mp4",
    "violations_csv": "app/outputs/a1b2c3d4e/violations.csv",
    "snapshots_dir": "app/outputs/a1b2c3d4e/snapshots/",
    "fir_txt": "app/outputs/a1b2c3d4e/fir.txt",
    "cosmos_txt": "app/outputs/a1b2c3d4e/cosmos_analysis.txt",
    "fir_preview": "On examination of the CCTV footage, an incident...",
    "cosmos_preview": "1. Sequence of Events..."
  }
}
```

### Get Run Response
```json
{
  "run_id": "a1b2c3d4e",
  "status": "done",
  "input_path": "app/outputs/a1b2c3d4e/video.mp4",
  "run_dir": "app/outputs/a1b2c3d4e",
  "message": "",
  "outputs": { ... }
}
```

### CSV Sample
```csv
camera_id,frame_id,timestamp,lane,speed_kmph,overspeed,label,confidence,color,helmet_violation,weapon_detected,fight_detected,fight_confidence,violation_type,violation_image
CAM_01,100,4.00,1,45.50,false,car,0.90,unknown,false,false,false,0.00,normal,
CAM_01,150,6.00,1,75.50,true,car,0.90,unknown,false,false,false,0.00,accident,snapshots/accident_frame150_t6.00.jpg
CAM_01,150,6.00,1,95.20,true,motorcycle,0.90,unknown,true,false,false,0.00,helmet,snapshots/accident_frame150_t6.00.jpg
CAM_01,200,8.00,1,55.30,false,bicycle,0.85,unknown,false,false,false,0.00,normal,
```

### FIR Sample
```text
On examination of the CCTV footage, an incident of road traffic accident 
was observed between approximately 5.50 seconds and 8.50 seconds in the said 
footage. The vehicles involved in the occurrence were identified in the 
footage as tracked objects bearing Track IDs [2, 5]. The sequence and exact 
manner of occurrence require verification from the scene, witnesses, and 
additional footage, if any.

Further, in the said footage, a motorcycle rider involved in the accident 
appears to be without a safety helmet, subject to verification due to camera 
angle/clarity.
```

---

**Document Version:** v1.0  
**Last Updated:** February 11, 2026  
**Status:** Production Ready
