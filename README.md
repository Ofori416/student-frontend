# EduAid — Student Academic Prediction System

EduAid predicts student academic performance using a hybrid machine learning model. It supports both single-student and bulk (Excel) predictions and can email results directly to students.

---

## Project Structure

```
student-frontend/
├── src/
│   ├── backend/          # Flask API + ML model
│   │   ├── app.py
│   │   └── hybrid_model.pkl
│   └── pages/            # Next.js pages
│       ├── single.js     # Single student prediction
│       └── multiple.js   # Bulk prediction via Excel upload
├── package.json
└── next.config.js
```

---

## Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.11+ (Anaconda recommended)
- **scikit-learn 1.8.0** (must match the model version)

---

## Backend Setup (Flask)

The backend runs on `http://localhost:5001`.

### 1. Install Python dependencies

```bash
pip install flask flask-cors pandas openpyxl scikit-learn==1.8.0
```

### 2. Start the server

```bash
cd src/backend
python app.py
```

You should see:

```
* Running on http://127.0.0.1:5001
* Debug mode: on
```

---

## Frontend Setup (Next.js)

The frontend runs on `http://localhost:3000`.

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

### `POST /predict`
Bulk prediction. Accepts either:
- An Excel file (`.xlsx`) via `multipart/form-data`
- A JSON array via `application/json`

**Required fields per record:** `index`, `email`, `gender`, `level`, `gpa_score`, `class_mode`, `study_mode`, `internet_availability`

**Field values:**

| Field | Values |
|---|---|
| `gender` | `0` = Male, `1` = Female |
| `internet_availability` | `0` = Bad, `1` = Normal, `2` = Good, `3` = Stable |
| `study_mode` | `0` = Lecture Notes, `1` = Online Resources, `2` = Personal Notes, `3` = Forums |
| `class_mode` | `"LMS"` or `"Class Room"` |
| `level` | `"L100"`, `"L200"`, `"L300"`, `"L400"` |
| `gpa_score` | Float between `0.0` and `4.0` |

---

### `POST /predict/s`
Single student prediction. Accepts a JSON object (or array with one item).

**Example request:**
```json
{
  "index": "10823344",
  "email": "student@example.com",
  "gender": 0,
  "level": "L300",
  "gpa_score": "3.5",
  "class_mode": "LMS",
  "study_mode": 1,
  "internet_availability": 2
}
```

**Example response:**
```json
[
  {
    "index": "10823344",
    "email": "student@example.com",
    "gender": 0,
    "level": "L300",
    "gpa_score": 3.5,
    "prediction": 1,
    "message": "Strong academic standing. Your GPA of 3.5..."
  }
]
```

**Prediction values:**

| Value | Class |
|---|---|
| `0` | First Class |
| `1` | Second Upper |
| `2` | Second Lower |
| `3` | Third Class |
| `4` | Fail |

---

### `POST /send-email`
Sends a prediction report to a student's email.

**Request body:**
```json
{
  "email": "student@example.com",
  "message": "Your prediction report..."
}
```

---

## Excel File Format (Bulk Upload)

The `.xlsx` file must contain these columns with the exact names:

| index | email | gender | level | gpa_score | class_mode | study_mode | internet_availability |
|---|---|---|---|---|---|---|---|
| 10823344 | student@example.com | 0 | L300 | 3.5 | LMS | 1 | 2 |

---

## Running Both Servers

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd src/backend
python app.py
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000).
