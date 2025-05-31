# NeuroCare-AI---Smart-Stroke-Risk-Prediction-and-Alert-System

---

## Introduction
Stroke remains a leading cause of death and long-term disability worldwide, with a significant burden in countries like India where timely diagnosis and access to medical care are often challenging, especially in rural areas. Current healthcare approaches often focus on post-stroke treatment, missing crucial opportunities for prevention. NeuroCare AI addresses this critical gap by providing an intelligent, proactive solution for early stroke risk prediction.

---

## Solution Overview
NeuroCare AI is a full-stack, AI-powered health monitoring platform designed to predict stroke risk based on an individual's medical history and lifestyle factors. It aims to provide early warnings, facilitate timely intervention, and improve accessibility to preventive healthcare information. The system features a user-friendly dashboard for risk assessment, real-time simulated vital sign monitoring, and an AI-powered chatbot for personalized health advice.

---

## Features
1) **Smart Stroke Risk Prediction:** Utilizes a trained Machine Learning model to assess stroke risk based on user-provided health metrics.
2) **Explainable AI (XAI) Ready:** Designed to incorporate SHAP (SHapley Additive exPlanations) to highlight the most influential factors contributing to a user's stroke risk, enhancing trust and understanding.(Currently, the SHAP integration is conceptual and displayed in the UI, but the backend is ready for it).
3) **Simulated Real-time Vitals:** Simulates input from wearable devices (e.g., heart rate, glucose, blood pressure) to demonstrate real-time monitoring capabilities, easily extensible to actual API integrations.
4) **Interactive Dashboard:** A clean and intuitive web interface for inputting data, viewing predictions, and understanding health insights.
5) **AI Chatbot:** An integrated chatbot powered by OpenAI's GPT models provides personalized advice on diet, exercise, and general medical considerations for stroke prevention.
6) **Privacy-Preserving Design:** Future-proofed for Federated Learning to ensure user data remains on their device during model training and improvement, addressing crucial privacy concerns.
7) **Emergency Alerts (Conceptual):** The system is designed to enable automatic notifications to caregivers if risk thresholds are exceeded.

---

 ## Innovation & Uniqueness

1) **Preventive Healthcare Focus:** Shifts the paradigm from reactive treatment to proactive prevention of stroke.
2) **AI Transparency with XAI:** Emphasizes interpretability by planning to show key risk factors using SHAP, building trust with both users and clinicians.
3) **Federated Learning Architecture (Future):** Readiness for privacy-preserving AI model improvements without centralizing sensitive patient data.
4) **Accessibility and Affordability:** Designed with a vision to be accessible and affordable for NGOs, rural clinics, and students, democratizing advanced healthcare technology.
5) **Hybrid Data Processing:** The underlying ML architecture (conceptually a CNN + LSTM hybrid model) is capable of combining static medical history with dynamic, real-time vital signs for a more comprehensive assessment.

---

## Tech Stack
1) **Python:** The core programming language.
2) **Flask:** A lightweight web framework for building RESTful APIs.
3) **Scikit-learn:** For machine learning model development (Random Forest Classifier).
4) **Imbalanced-learn (imblearn):** For handling imbalanced datasets (e.g., SMOTE for oversampling).
5) **Joblib:** For efficient serialization and deserialization of Python objects (saving/loading ML models).
6) **Pandas:** For data manipulation and analysis.
7) **NumPy:** For numerical operations.
8) **OpenAI API:** For powering the intelligent chatbot.
9) **python-dotenv:** For managing environment variables securely.
10) **Flask-CORS:** To enable Cross-Origin Resource Sharing for frontend-backend communication.

## Frontend:
1) **HTML5:** For structuring the web pages.
2) **CSS3:** For styling and responsive design.
3) **JavaScript:** For interactive elements, form handling, API communication, and dynamic content updates.
4) **Chart.js & chartjs-plugin-datalabels**: For creating interactive and informative data visualizations.

---

## Dataset:
```bash
healthcare-dataset-stroke-data.csv
```
 ## Project Structure
 ```bash
NeuroCare-AI/
├── app.py                      # Flask backend application
├── train_model.py              # Script for training and saving the ML model
├── healthcare-dataset-stroke-data.csv  # Dataset for stroke prediction
├── random_forest_stroke_model.joblib # Trained ML model (generated after running train_model.py)
├── key.env.txt                 # Environment variables for API keys (e.g., OpenAI)
├── static/
│   ├── style.css               # Frontend CSS styles
│   └── script.js               # Frontend JavaScript logic
└── templates/
    └── index.html              # Frontend HTML structure
└── NeuroCare_Ai_Presentation.pdf # Project presentation slides
└── README.md                   # This README file
```

---

## Getting Started
Follow these instructions to set up and run the NeuroCare AI project locally.

**Prerequisites**
Python 3.8+
pip (Python package installer)

## Installation
**Clone the repository:**

```Bash
git clone https://github.com/your-username/NeuroCare-AI.git
cd NeuroCare-AI
```
**Create a virtual environment (recommended):**

```Bash

python -m venv venv
```
```Bash 
# On Windows
.\venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```
Install the required Python packages:

```Bash
pip install -r requirements.txt
```
(Note: A requirements.txt file is not explicitly provided but can be generated using pip freeze > requirements.txt after installing dependencies or created manually with the packages listed in the "Tech Stack" section.)

**Minimum required packages for requirements.txt:**
```bash
Flask
flask-cors
joblib
pandas
scikit-learn
imblearn
numpy
google.generativeai
python-dotenv
```
## Environment Variables
**Create a key.env.txt file:**
In the root directory of your project, create a file named key.env.txt.

**Add your OpenAI API Key:**
Obtain an API Key from the Gemini AI studio platform. Add it to your key.env.txt file in the following format:
```bash
Gemini_API_KEY="your_openai_api_key_here"
```
Replace "your_openai_api_key_here" with your actual OpenAI API key.
## Running the Application
**Train the Machine Learning Model:**
Before running the Flask application, you need to train the ML model and save it.
```Bash
python train_model.py
```
This script will train a Random Forest Classifier and save the preprocessor and model pipeline as random_forest_stroke_model.joblib (or random_forest_stroke_model_v2.joblib) in your project directory.

**Start the Flask Backend Server:**
```Bash
python app.py
```
The Flask application will start, typically on http://127.0.0.1:5000/. You should see messages indicating that the model and OpenAI client were loaded successfully.

**Access the Frontend:**
Open your web browser and navigate to http://127.0.0.1:5000/. This will serve the index.html file, and the frontend will interact with the running Flask backend.

---

## Usage
Once the application is running, you can:

1) **Prediction Dashboard:** Navigate to the "Dashboard" section. Input the requested medical and lifestyle parameters (e.g., gender, age, hypertension, heart disease, ever married, work type, residence type, average glucose level, BMI, smoking status). Click "Predict Risk" to get a stroke risk assessment.
2) **Insights Section:** (Conceptual/Visualization) View visual representations of data (e.g., BMI distribution, glucose levels) to understand health patterns.
3) **Chatbot Section:** Interact with the AI chatbot. Select a planner type (Diet, Exercise, Medical) and enter your query. The chatbot will provide relevant advice based on your input.

---

## Machine Learning Model Details
1) **Model Type:** Random Forest Classifier
2) **Dataset:** healthcare-dataset-stroke-data.csv
3) **Preprocessing:**
Handles missing bmi values using SimpleImputer (median strategy).
Encodes categorical features (gender, ever_married, work_type, Residence_type, smoking_status) using OneHotEncoder.
Scales numerical features (age, avg_glucose_level, bmi) using StandardScaler.
Removes the single 'Other' gender entry to avoid issues with one-hot encoding.
4) **Class Imbalance Handling:** Employs SMOTE (Synthetic Minority Over-sampling Technique) within the ImbPipeline to address the imbalance between stroke and non-stroke cases in the dataset.
5) **Pipeline:** A scikit-learn compatible pipeline combines preprocessing steps and the classifier, ensuring consistent data transformation during training and prediction.
6) **Evaluation:** The train_model.py script outputs classification reports, confusion matrices, and ROC AUC scores for model evaluation. It also includes comments on how to interpret and potentially address issues like the model "always predicting no stroke."

---

## Future Scope
NeuroCare AI is an evolving project with several planned enhancements:

1) **Advanced XAI:** Deeper Explainable AI with interactive SHAP visualizations.
2) **Real-time Wearable Integration:** Seamless integration with actual wearable device APIs (e.g., Fitbit, Mi Band, Apple HealthKit) for genuine real-time vital sign monitoring.
3) **IoT-based Anomaly Detection:** Implementing systems to identify unusual patterns in vital signs that may indicate imminent stroke risk.
4) **Federated Learning Implementation:** Full integration of federated learning using frameworks like PySyft or TensorFlow Federated (TFF) for privacy-preserving model training.
5) **Enhanced AI Chatbot:** Expanding the chatbot's capabilities to include mental health advice and more comprehensive medical insights.
6) **Multilingual Voice UI:** Developing a voice-enabled user interface with support for multiple languages, specifically targeting rural populations in India.
7) **Gamification & Community Features:** Introducing health goals, rewards, challenges, and peer support networks to enhance user engagement.
8) **Scalability Expansion:** Extending the prediction capabilities to include other prevalent health conditions such as heart attacks, diabetes, and hypertension.

---

## Impact Potential
NeuroCare AI has the potential to make a significant impact across multiple dimensions:

1) Social Impact: Aims to dramatically reduce stroke-related mortality and morbidity by enabling early detection and intervention, particularly in underserved and rural communities.
2) Technological Impact: Showcases the practical application of responsible and interpretable AI in healthcare, fostering trust and accelerating AI adoption in sensitive domains.
3) Educational Impact: Serves as a powerful tool for educating individuals and communities about stroke prevention, healthy lifestyles, and the importance of early diagnosis.
4) Healthcare Access: Bridges geographical and economic barriers to advanced healthcare by providing an affordable and accessible preventive solution.
5) Life-Saving Potential: By shifting the focus from treatment to prevention, NeuroCare AI can potentially save countless lives and improve the quality of life for many.

---

## Contributing
We welcome contributions! If you have suggestions for improvements, bug fixes, or new features, please feel free to:

1) Fork the repository.
2) Create a new branch (git checkout -b feature/YourFeatureName).
3) Make your changes.
4) Commit your changes (git commit -m 'Add new feature').
5) Push to the branch (git push origin feature/YourFeatureName).
6) Open a Pull Request.
