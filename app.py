from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load model
model_path = os.path.join(os.path.dirname(__file__), 'model', 'emotion_classifier_pipe_lr.pkl')
classifier_model = joblib.load(model_path)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data['text']

    probabilities = classifier_model.predict_proba([text])[0]
    predicted_index = probabilities.argmax()
    predicted_emotion = classifier_model.classes_[predicted_index]
    confidence = float(probabilities[predicted_index])
    emotion_probs = dict(zip(classifier_model.classes_, map(float, probabilities)))

    return jsonify({
        'emotion': predicted_emotion,
        'confidence': confidence,
        'probabilities': emotion_probs
    })

if __name__ == '__main__':
    app.run(debug=True)
