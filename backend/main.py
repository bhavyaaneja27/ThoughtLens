from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import numpy as np
import uvicorn
# Load models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "sentence_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "sentence_vectorizer.pkl")

# Initialize models
model = None
vectorizer = None

try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("Models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    raise

app = FastAPI(title="ThoughtLens API")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ThoughtRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "ThoughtLens API is running successfully."}

@app.post("/analyze")
def analyze_thought(request: ThoughtRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    if model is None or vectorizer is None:
        raise HTTPException(status_code=500, detail="Machine learning models are not loaded.")

    try:
        # Transform the text using the saved TF-IDF vectorizer
        X = vectorizer.transform([text])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during text vectorization: {e}")

    try:
        predictions = []
        
        # Predict probabilities to get top 3 scores
        if hasattr(model, "predict_proba"):
            probas = model.predict_proba(X)[0]
            classes = model.classes_
            
            # Get indices of top 3 scores
            top_3_idx = np.argsort(probas)[-3:][::-1]
            
            for idx in top_3_idx:
                predictions.append({
                    "distortion": str(classes[idx]),
                    "score": float(probas[idx])
                })
        elif hasattr(model, "decision_function"):
            decision = model.decision_function(X)
            classes = model.classes_
            
            # Handle binary classification edge case for decision_function
            if len(classes) == 2:
                score = float(decision[0])
                predictions = [
                    {"distortion": str(classes[1]), "score": score},
                    {"distortion": str(classes[0]), "score": -score}
                ]
            else:
                decision = decision[0]
                top_3_idx = np.argsort(decision)[-3:][::-1]
                for idx in top_3_idx:
                    predictions.append({
                        "distortion": str(classes[idx]),
                        "score": float(decision[idx])
                    })
        else:
            # Fallback if no probabilities or decision function are available
            pred = model.predict(X)[0]
            predictions = [{"distortion": str(pred), "score": 1.0}]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {e}")

    return {
        "original_text": text,
        "predictions": predictions
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
