from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv(dotenv_path="key.env.txt")

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend to backend communication

MODEL_PATH = 'random_forest_stroke_model_v2.joblib'

# Load prediction model
try:
    model_pipeline = joblib.load(MODEL_PATH)
    print("Model loaded successfully.")
except FileNotFoundError:
    print(f"Error: Model file '{MODEL_PATH}' not found. Please run 'train_model.py' first to generate it.")
    model_pipeline = None
except Exception as e:
    print(f"Error loading model: {e}")
    model_pipeline = None

# Configure Gemini API
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found in environment.")
    gemini_model = None
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel(model_name="models/gemini-2.0-flash")
        print("Gemini model initialized successfully.")
    except Exception as e:
        print(f"Error initializing Gemini model: {e}")
        gemini_model = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict_stroke', methods=['POST'])
def predict_stroke():
    if model_pipeline is None:
        return jsonify({'error': 'Model not loaded. Please ensure the model file exists.'}), 500

    data = request.json
    if not data:
        return jsonify({'error': 'No input data provided.'}), 400

    try:
        input_df = pd.DataFrame([data])
        if 'id' in input_df.columns:
            input_df = input_df.drop('id', axis=1)

        prediction_proba = model_pipeline.predict_proba(input_df)[:, 1][0]
        prediction = 1 if prediction_proba >= 0.5 else 0

        result = {
            'prediction': 'Stroke' if prediction == 1 else 'No Stroke',
            'probability': float(prediction_proba)
        }
        return jsonify(result)
    except KeyError as e:
        return jsonify({'error': f"Missing data for feature: {e}. Please ensure all required fields are provided."}), 400
    except Exception as e:
        return jsonify({'error': f"An error occurred during prediction: {str(e)}"}), 500

@app.route('/chatbot', methods=['POST'])
def chatbot():
    if gemini_model is None:
        return jsonify({'error': 'Gemini model not initialized.'}), 500

    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided for chatbot.'}), 400

    try:
        response = gemini_model.generate_content([
            f"You are a helpful assistant for health-related queries, focusing on stroke prevention and general well-being.",
            f"User: {user_message}"
        ])
        return jsonify({'reply': response.text.strip()})
    except Exception as e:
        print(f"Gemini API error: {e}")
        return jsonify({'error': f"Failed to communicate with Gemini API: {str(e)}"}), 500

@app.route('/alert_system', methods=['POST'])
def alert_system():
    data = request.json
    patient_info = data.get('patient_info', 'N/A')
    risk_level = data.get('risk_level', 'N/A')
    print(f"ALERT: High stroke risk detected for {patient_info} with risk level {risk_level}!")
    return jsonify({'status': 'Alert processed', 'message': 'Caregivers would be notified.'})

@app.route('/planner/<plan_type>', methods=['POST'])
def planner(plan_type):
    if gemini_model is None:
        return jsonify({'error': 'Gemini model not initialized.'}), 500

    user_input = request.json.get('input', '')
    if not user_input:
        return jsonify({'error': f'No input provided for {plan_type} planner.'}), 400

    system_prompt = ""
    if plan_type == 'food':
        system_prompt = "You are an AI nutrition expert. Provide a healthy food diet plan for stroke prevention. Be concise and actionable."
    elif plan_type == 'exercise':
        system_prompt = "You are an AI fitness coach. Suggest an exercise routine for stroke prevention. Emphasize safety and moderation."
    elif plan_type == 'medical':
        system_prompt = "You are an AI medical advisor. Provide general medical advice or considerations for stroke prevention. Always advise consulting a doctor."
    else:
        return jsonify({'error': 'Invalid planner type.'}), 400

    try:
        response = gemini_model.generate_content([
            system_prompt,
            f"User Input: {user_input}"
        ])
        return jsonify({'plan': response.text.strip()})
    except Exception as e:
        print(f"Gemini API error for {plan_type} planner: {e}")
        return jsonify({'error': f"Failed to communicate with Gemini API: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
