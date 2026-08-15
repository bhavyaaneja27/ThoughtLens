# ThoughtLens Backend

This is the FastAPI backend for ThoughtLens. It uses a trained machine learning model to analyze user thoughts and predict cognitive distortions.

## Setup Instructions

1. **Activate the virtual environment**:
   - On Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

2. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Run the server**:
   From the `backend` directory, run:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://127.0.0.1:8000`.

## Endpoints

- `GET /` - Health check.
- `POST /analyze` - Analyze text for cognitive distortions. Requires a JSON body like:
  ```json
  {
    "text": "I failed one exam, so I am going to fail this entire semester."
  }
  ```
