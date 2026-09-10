# SAFE (Safe Analytics for Financial Examination)

**Financial Fraud Detection on Credit Card and General Transactions with Financial News Headline Sentiment Analysis**

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-3-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud_Run-4285F4?style=flat-square&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)

---

## Overview

SAFE is an end-to-end machine learning platform that combines financial fraud detection with sentiment analysis of financial news headlines. The system is designed to help financial institutions and investors minimize risk while identifying potential investment opportunities.

The project addresses two critical problems in the financial industry:

1. **Fraudulent activity detection** on credit card and general financial transactions using an ensemble of machine learning algorithms, enhanced with Synthetic Minority Oversampling Technique (SMOTE) and Random Undersampling to handle severe class imbalance.
2. **Market sentiment insights** derived from English and Indonesian financial news headlines using state-of-the-art NLP models (RoBERTa and LSTM), classified into positive, neutral, or negative signals.

SAFE is delivered as a web application with an intuitive user interface for real-time transaction analysis, fraud result visualization, security assessments, and sentiment dashboards.

---

## Key Features

### Fraud Detection
- Multi-algorithm Voting Classifier ensemble combining:
  - Logistic Regression
  - Random Forest
  - Gradient Boosting
  - XGBoost
- Class imbalance handling using SMOTE and Random Undersampling
- Preprocessing pipeline: standardization, missing-value handling, and feature engineering
- Risk scoring with categorical classification (Low, Medium, High Risk)
- Detailed risk-factor breakdown:
  - Location Risk
  - Verification Risk
  - Purchase Risk
- Fraud-pattern visualization
- Security assessment with mitigation recommendations (card freeze, two-factor authentication activation, etc.)

### News Sentiment Analysis
- Financial headline sentiment classification: Positive, Neutral, Negative
- Support for both English and Indonesian headlines
- Powered by RoBERTa and LSTM models
- Domain-specific text preprocessing: tokenization, lemmatization, stopword removal
- Designed as an investment decision-support signal

### Web Application
- Secure authentication via Clerk Auth (Google and email)
- Responsive, type-safe UI built with Next.js and TypeScript
- Integrated payments via Stripe
- Historical detection log and dashboard summary
- Detailed analysis views for each transaction and headline

---

## System Architecture

SAFE is composed of two primary ML pipelines exposed through a unified web platform.

```
+--------------------------------------------------------------+
|                      SAFE Web Application                    |
|                 (Next.js + TypeScript + Clerk)               |
+--------------------------------------------------------------+
                              |
                              v
+--------------------------------------------------------------+
|                    Flask REST API (Docker)                   |
|                  Deployed on Google Cloud Run                |
+--------------------------------------------------------------+
              |                                  |
              v                                  v
+---------------------------+      +---------------------------+
|   Fraud Detection Engine  |      |   Sentiment Analysis      |
|  -----------------------  |      |  -----------------------  |
|  - Preprocessing          |      |  - Text preprocessing     |
|  - SMOTE + Undersampling  |      |  - RoBERTa / LSTM         |
|  - Voting Classifier      |      |  - Sentiment classifier   |
|    - Logistic Regression  |      |  - EN + ID support        |
|    - Random Forest        |      |                           |
|    - Gradient Boosting    |      |                           |
|    - XGBoost              |      |                           |
+---------------------------+      +---------------------------+
              |                                  |
              +--------------+-------------------+
                             v
                  +---------------------+
                  |     PostgreSQL      |
                  | (transactions,      |
                  |  results, users)    |
                  +---------------------+
```

### Architecture Highlights
- Ensemble learning for robust fraud detection
- Transformer-based NLP (RoBERTa) combined with sequential modeling (LSTM)
- Containerized deployment for portability and scalability
- Serverless cloud deployment on Google Cloud Run

---

## Technology Stack

| Layer                | Technology                                                                 |
| -------------------- | -------------------------------------------------------------------------- |
| ML / Experiments     | Python, Google Colab, Jupyter Notebook                                     |
| ML Libraries         | scikit-learn, XGBoost, imbalanced-learn (SMOTE), Hugging Face Transformers, TensorFlow/Keras (LSTM) |
| Backend              | Flask, REST API, Docker                                                    |
| Deployment           | Google Cloud Run                                                           |
| Frontend             | Next.js, TypeScript                                                        |
| Database             | PostgreSQL                                                                 |
| Authentication       | Clerk Auth                                                                 |
| Payments             | Stripe                                                                     |

---

## Dataset

| Dataset                        | Size                              | Source                     |
| ------------------------------ | --------------------------------- | -------------------------- |
| Credit Card Transactions       | 912,597 transactions              | Kaggle                     |
| General Financial Transactions | 6.3 million transactions          | Kaggle                     |
| Financial News Headlines       | 50,000 headlines (EN and ID)      | Kaggle                     |

**Note:** Datasets are limited to Kaggle sources and may not fully represent real-world variance. This is acknowledged as a known limitation of the project.

---

## Methodology

### Fraud Detection Pipeline
1. Data cleaning: missing-value imputation and outlier removal
2. Feature engineering: derived risk-relevant features
3. Standardization: feature scaling for distance-based models
4. Class balancing: SMOTE (synthetic minority oversampling) and Random Undersampling
5. Model training: Logistic Regression, Random Forest, Gradient Boosting, XGBoost
6. Ensembling: soft/hard Voting Classifier aggregating all base models
7. Evaluation: calibrated probability metrics suited for imbalanced classification

### Sentiment Analysis Pipeline
1. Text preprocessing: tokenization, lemmatization, domain-specific stopword removal
2. Language handling: separate pipelines for English and Indonesian headlines
3. Model training: RoBERTa (transformer) and LSTM (recurrent)
4. Classification: Positive, Neutral, Negative labels
5. Signal output: aggregated sentiment as an investment signal

---

## User Interface

SAFE provides a complete UX covering onboarding, analysis, and reporting. Key screens include:

- Hero Section: landing page with the tagline "Predict, Prevent, and Protect with SAFE"
- Sign-in and Sign-up: Google or email authentication via Clerk
- Dashboard: overview of total detections, fraud cases, and legitimate transactions with a history table
- Analysis Detail: full transaction detail with risk score (e.g., 70 = Medium Risk)
- Risk Factors: Location, Verification, and Purchase risk categorization
- Security Assessment: fraud alerts with mitigation steps (card freeze, two-factor authentication)
- Credit Card Fraud Pages: input, result, recommendation, pattern, and risk-factor views
- General Transaction Pages: result, action recommendation, section analysis, pattern, and impact views
- Financial News Sentiment: headline list and sentiment analysis result

---

## Getting Started

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher and npm/pnpm
- PostgreSQL 16 or higher
- Docker (optional, for containerized runs)
- API keys for Clerk and Stripe

### 1. Clone the repository
```bash
git clone https://github.com/<your-org>/safe.git
cd safe
```

### 2. Backend setup (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/safe
FLASK_ENV=development
MODEL_PATH=./models
```

Run the server:
```bash
flask run --host=0.0.0.0 --port=5000
```

### 3. Frontend setup (Next.js)
```bash
cd ../frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your_stripe_key>
STRIPE_SECRET_KEY=<your_stripe_secret>
```

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 4. Docker (optional)
```bash
docker build -t safe-backend ./backend
docker run -p 5000:5000 --env-file ./backend/.env safe-backend
```

---

## Project Structure

```
safe/
├── backend/                    # Flask API and ML models
│   ├── app/
│   │   ├── routes/             # REST endpoints
│   │   ├── models/             # Trained model artifacts
│   │   ├── services/           # Fraud and sentiment inference
│   │   └── utils/              # Preprocessing helpers
│   ├── notebooks/              # Colab/Jupyter experiments
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                   # Next.js application
│   ├── app/                    # App Router pages
│   ├── components/             # UI components
│   ├── lib/                    # API clients and helpers
│   ├── public/
│   └── package.json
├── datasets/                   # (gitignored) local data
├── docs/                       # Additional documentation
└── README.md
```

---

## Results and Evaluation

Model evaluation focuses on imbalanced classification metrics:
- Precision, Recall, F1-Score per class
- ROC-AUC and PR-AUC
- Confusion matrices for fraud versus legitimate classes
- Sentiment classification accuracy per label

Sentiment performance on the negative class is still an area for improvement, which is noted as a limitation in the technical report.

---

## Limitations

- Datasets are limited to Kaggle and may not reflect full real-world variance.
- Imbalance handling is limited to SMOTE and Random Undersampling.
- Fraud models tested: Logistic Regression, Random Forest, Gradient Boosting, XGBoost.
- Sentiment models limited to RoBERTa and LSTM.
- System depends on cloud infrastructure and internet connectivity, which may impact scalability and offline responsiveness.

---

## Team

**Kelompok 4 (SAFENET INDONESIA)**

| Name                | NIM        |
| ------------------- | ---------- |
| Alya Yulhadi        | 2207412026 |
| Aurio Rajaa         | 2207412016 |
| Muhammad Nathan     | 2207412024 |
| Rayhan Alfarizi     | 2207412001 |

Program Studi Teknik Informatika  
Jurusan Teknik Informatika dan Komputer  
Politeknik Negeri Jakarta  
2025

---

## References

1. Elreedy, D., & Atiya, A. F. (2019). A Comprehensive Analysis of Synthetic Minority Oversampling Technique (SMOTE) for handling class imbalance.
2. Hilal, W., et al. (2022). Financial Fraud Detection using Anomaly Detection Techniques.
3. Liu, Y., et al. (2019). RoBERTa: A Robustly Optimized BERT Pretraining Approach.
4. Dal Pozzolo, A., et al. (2015). Calibrating Probability with Undersampling for Unbalanced Classification.

---

## License

This project was developed as part of an academic requirement at Politeknik Negeri Jakarta. Please contact the team for reuse or collaboration inquiries.

---

## Acknowledgements

- Politeknik Negeri Jakarta for academic support
- Kaggle for the public datasets used in this research
- Open-source communities behind scikit-learn, XGBoost, Hugging Face, Next.js, and Flask
