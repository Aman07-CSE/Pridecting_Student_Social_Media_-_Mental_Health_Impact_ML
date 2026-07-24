# Mental Health Impact Predictor

A FastAPI-based web app that predicts a student's mental health score from social media habits and lifestyle inputs. The project includes a responsive frontend with a polished UI, client-side validation, loading animation, and a score result card.

## Features

- Attractive responsive UI for mobile and desktop
- All `StudentData` fields included in the form
- Prediction request sent with `fetch()`
- Loading animation while waiting for the backend
- Friendly error handling for validation and API failures
- Result card with animated score display
- Country selector based on the backend-supported values

## Project Structure

- `main.py` - FastAPI backend and prediction endpoint
- `Mental_Health_Model.pkl` - trained machine learning model
- `static/index.html` - main UI page
- `static/style.css` - app styling
- `static/script.js` - frontend logic and API calls

## Requirements

- Python 3.10+ recommended
- FastAPI
- Uvicorn
- Pandas
- Joblib
- Scikit-learn

Install dependencies with:

```bash
pip install -r requirements.txt
```

## Run Locally

Start the app from the project folder:

```bash
uvicorn main:app --reload
```

Then open:

```text
http://127.0.0.1:8000
```

## API Endpoint

### `POST /post/pridict`

Request body must match the backend `StudentData` schema.

Example:

```json
{
  "age": 22,
  "gender": "Male",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Entertainment",
  "avg_daily_usage_hours": 4.5,
  "daily_unlocks": 18,
  "study_hours": 5,
  "physical_activity_hours": 1.5,
  "sleep_hours_per_night": 7,
  "stress_level": "Medium"
}
```

Success response:

```json
{
  "predicted_mental_health_score": 5.96
}
```

## Notes

- The model is loaded from `Mental_Health_Model.pkl` at startup.
- If you deploy this project, make sure the scikit-learn version on the server matches the version used to create the pickle file.
- The frontend automatically scrolls to the score section after prediction.

## Deployment

A simple deployment command for hosts like Render or Railway:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Make sure the `static` folder and `Mental_Health_Model.pkl` file are included in the deployment.

## Live Demo

Added deployed project link here:

```text
[LIVE 
Pridecting_Mental_Health_Impact_Of_Student_ML](https://pridecting-mental-health-impact-ml.onrender.com/)
```

You can replace the placeholder with your actual Render, Railway, Azure, or other hosted URL.
