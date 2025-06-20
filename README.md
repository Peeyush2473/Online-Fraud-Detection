# Online Fraud Detection Web App

This is a Flask-based web application for detecting fraudulent transactions using a pre-trained machine learning model. The app takes transaction details as input, processes them, and provides a prediction on whether the transaction is fraudulent or legitimate, along with a confidence score.

## Features
- **Fraud Detection**: Predicts if a transaction is fraudulent or legitimate using a pre-trained model.
- **Input Parameters**: Accepts transaction amount, original and destination account balances, and transaction type (CASH_IN, CASH_OUT, DEBIT, TRANSFER, PAYMENT).
- **Confidence Score**: Provides a confidence percentage for the prediction.
- **Processing Time**: Displays the time taken to process the prediction.
- **CORS Support**: Enabled for integration with frontends hosted on different domains.
- **Error Handling**: Returns meaningful error messages for invalid inputs.

## Prerequisites
- Python 3.7+
- Flask
- Flask-CORS
- NumPy
- Pickle (for loading the pre-trained model)
- A pre-trained model file (`fraud_model1.pkl`)

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install flask flask-cors numpy
   ```
4. Ensure the `fraud_model1.pkl` file is in the project root directory.

## Usage
1. Run the Flask application:
   ```bash
   python app.py
   ```
2. Open a browser and navigate to `http://127.0.0.1:5000/` to access the home page.
3. Use the frontend (e.g., `index.html`) to input transaction details and submit them to the `/predict` endpoint.
4. The app will return a JSON response with the prediction result, confidence score, and processing time.

## Example Input
Submit a POST request to `/predict` with the following form data:
- `amount`: 1000.00
- `oldbalanceOrg`: 5000.00
- `newbalanceOrig`: 4000.00
- `oldbalanceDest`: 2000.00
- `newbalanceDest`: 3000.00
- `type`: CASH_OUT

Example response:
```json
{
  "status": "success",
  "result": "❌ Fraudulent Transaction Detected!",
  "confidence": "95.67%",
  "processing_time": "0.02s",
  "transaction_type": "CASH_OUT",
  "amount": 1000.0
}
```

## File Structure
- `app.py`: Main Flask application file.
- `fraud_model1.pkl`: Pre-trained machine learning model file.
- `templates/index.html`: Frontend HTML file for user interaction.
- `README.md`: Project documentation (this file).

## Notes
- The `fraud_model1.pkl` file must be a valid pickled model compatible with scikit-learn or a similar library.
- Ensure the frontend (`index.html`) is properly configured to send form data to the `/predict` endpoint.
- Debug mode is enabled by default (`app.run(debug=True)`). Disable it in production for security.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.