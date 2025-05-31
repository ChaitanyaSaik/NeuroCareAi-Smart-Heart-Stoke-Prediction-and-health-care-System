import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from imblearn.pipeline import Pipeline as ImbPipeline # Renamed for clarity from your original
from imblearn.over_sampling import SMOTE
import joblib
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

def train_and_save_model():
    try:
        df = pd.read_csv('DATA/healthcare-dataset-stroke-data.csv')
        print("Dataset loaded successfully.")
    except FileNotFoundError:
        print("Error: 'healthcare-dataset-stroke-data.csv' not found. Please ensure the file is in the same directory.")
        return

    df = df[df['gender'] != 'Other']
    print(f"Shape of DataFrame after removing 'Other' gender: {df.shape}")

    X = df.drop(['stroke', 'id'], axis=1) # Drop 'id' upfront as it's not a feature
    y = df['stroke']
    print(f"Shape of X: {X.shape}, Shape of y: {y.shape}")
    print(f"Class distribution in y:\n{y.value_counts(normalize=True)}")

    categorical_features = X.select_dtypes(include=['object', 'category']).columns.tolist()
    numerical_features = X.select_dtypes(include=np.number).columns.tolist()

    print(f"\nIdentified Numerical Features: {numerical_features}")
    print(f"Identified Categorical Features: {categorical_features}")

    numerical_transformer = ImbPipeline(steps=[
        ('imputer', SimpleImputer(strategy='mean')),
        ('scaler', StandardScaler()) # Added StandardScaler
    ])

    categorical_transformer = ImbPipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False)) # sparse_output=False for easier inspection if needed
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, numerical_features),
            ('cat', categorical_transformer, categorical_features)
        ],
        remainder='passthrough' # Should be empty if all features are covered
    )
    print("\nPreprocessor created.")

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"X_train shape: {X_train.shape}, X_test shape: {X_test.shape}")
    print(f"y_train class distribution:\n{y_train.value_counts(normalize=True)}")
    print(f"y_test class distribution:\n{y_test.value_counts(normalize=True)}")


    model_pipeline = ImbPipeline(steps=[
        ('preprocessor', preprocessor),
        ('smote', SMOTE(random_state=42, k_neighbors=min(4, sum(y_train==1)-1) if sum(y_train==1) > 1 else 1)), # Adjust k_neighbors dynamically
        ('classifier', RandomForestClassifier(random_state=42, class_weight=None)) # class_weight=None if using SMOTE
    ])
   
    minority_samples_in_train = sum(y_train == 1)
    smote_k_neighbors = min(5, minority_samples_in_train - 1) if minority_samples_in_train > 1 else 1
    
    model_pipeline.set_params(smote__k_neighbors=smote_k_neighbors)
    print(f"SMOTE k_neighbors set to: {smote_k_neighbors}")


    print("\nTraining model with SMOTE for class imbalance...")
    model_pipeline.fit(X_train, y_train)
    print("Model training complete.")

    print("\n--- Model Evaluation on Test Set ---")
    y_pred_test = model_pipeline.predict(X_test)
    y_pred_proba_test = model_pipeline.predict_proba(X_test)[:, 1] # Probability of positive class

    print("\nConfusion Matrix (Test Set):")
    print(confusion_matrix(y_test, y_pred_test))

    print("\nClassification Report (Test Set):")
    print(classification_report(y_test, y_pred_test, target_names=['No Stroke (0)', 'Stroke (1)']))

    print(f"\nROC AUC Score (Test Set): {roc_auc_score(y_test, y_pred_proba_test):.4f}")


    joblib.dump(model_pipeline, 'random_forest_stroke_model_v2.joblib')
    print("\nModel and preprocessing pipeline (with SMOTE and Scaler) saved as 'random_forest_stroke_model_v2.joblib'")

if __name__ == '__main__':
    train_and_save_model()
