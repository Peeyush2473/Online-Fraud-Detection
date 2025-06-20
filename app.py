from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import time

# Load the model
with open("fraud_model1.pkl", "rb") as f:
    model = pickle.load(f)

app = Flask(__name__)
CORS(app)  # Enable CORS if frontend is hosted separately

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=["POST"])
def predict():
    try:
        start_time = time.time()
        
        amount = float(request.form['amount'])
        oldbalanceOrg = float(request.form['oldbalanceOrg'])
        newbalanceOrig = float(request.form['newbalanceOrig'])
        oldbalanceDest = float(request.form['oldbalanceDest'])
        newbalanceDest = float(request.form['newbalanceDest'])
        transaction_type = request.form['type']

        # One-hot encode type
        type_dict = {
            "CASH_IN": [0, 0, 0, 0],
            "CASH_OUT": [1, 0, 0, 0],
            "DEBIT": [0, 1, 0, 0],
            "TRANSFER": [0, 0, 1, 0],
            "PAYMENT": [0, 0, 0, 1]
        }
        encoded_type = type_dict.get(transaction_type, [0, 0, 0, 0])

        final_input = np.array([[amount, oldbalanceOrg, newbalanceOrig,
                                 oldbalanceDest, newbalanceDest] + encoded_type])

        # Get prediction and confidence score
        prediction = model.predict(final_input)[0]
        confidence = model.predict_proba(final_input)[0][prediction] * 100  # Convert to percentage
        processing_time = time.time() - start_time

        result = "❌ Fraudulent Transaction Detected!" if prediction == 1 else "✅ Transaction Seems Legitimate."
        
        print(result)
        return jsonify({
            "status": "success",
            "result": result,
            "confidence": f"{confidence:.2f}%",
            "processing_time": f"{processing_time:.2f}s",
            "transaction_type": transaction_type,
            "amount": amount
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error: {str(e)}"
        }), 400

if __name__ == '__main__':
    app.run(debug=True)