from flask import Flask, request, jsonify
import pandas as pd
import pickle
from flask_cors import CORS
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

pickle_file_path = "./hybrid_model.pkl"

with open(pickle_file_path, 'rb') as file:
    loaded_model = pickle.load(file)

app = Flask(__name__)
CORS(app)

def get_gpa_category(gpa_score):
    if 4.0 >= gpa_score >= 3.6:
        return 0
    elif 3.59 >= gpa_score >= 3.0:
        return 1
    elif 2.99 >= gpa_score >= 2.0:
        return 3
    else:
        return -1  # Return -1 for any GPA score outside the specified ranges

INTERNET_LABELS = {0: "poor", 1: "average", 2: "good", 3: "stable"}
STUDY_LABELS = {0: "lecture notes", 1: "online resources", 2: "personal notes", 3: "online forums"}

def get_message(prediction, gpa_score, internet_availability, study_mode):
    internet = INTERNET_LABELS.get(internet_availability, str(internet_availability))
    study = STUDY_LABELS.get(study_mode, str(study_mode))

    if prediction == 0:
        return (
            f"Outstanding academic profile! With a GPA of {gpa_score} and a strong reliance on {study}, "
            f"you are on track for a First Class degree. Your {internet} internet connectivity supports your learning effectively. "
            f"Keep maintaining this level of discipline — consider exploring research opportunities, internships, or advanced coursework "
            f"to further distinguish your academic record."
        )
    elif prediction == 1:
        return (
            f"Strong academic standing. Your GPA of {gpa_score}, combined with your use of {study} and {internet} internet access, "
            f"puts you on a clear path to a Second Upper Class degree. "
            f"To push toward a First Class, focus on improving weaker subject areas, increase engagement with {study}, "
            f"and seek feedback from lecturers consistently."
        )
    elif prediction == 2:
        return (
            f"Moderate academic performance. Your GPA of {gpa_score} places you in Second Lower Class territory. "
            f"Your current study approach using {study} is a start, but your {internet} internet access may be limiting your resources. "
            f"Consider supplementing with group study sessions, visiting the library for stable internet, "
            f"and actively engaging with course materials beyond what is covered in class."
        )
    elif prediction == 3:
        return (
            f"Your academic performance needs significant attention. A GPA of {gpa_score} indicates recurring challenges in key subject areas. "
            f"Relying primarily on {study} with {internet} internet access is not providing enough support for your learning needs. "
            f"We strongly recommend meeting with your academic advisor, attending tutoring sessions, "
            f"and restructuring your study schedule to include more consistent and varied study methods."
        )
    elif prediction == 4:
        return (
            f"Critical academic risk. Your GPA of {gpa_score} reflects serious difficulty keeping up with academic demands. "
            f"With {internet} internet access and a dependency on {study} alone, your current approach is insufficient. "
            f"Immediate action is required — speak with your department's student support team, consider course load adjustments, "
            f"and build a structured daily study plan. Recovery is possible with the right intervention and commitment."
        )
    else:
        return "Prediction could not be determined. Please verify the submitted data and try again."

@app.route('/predict', methods=['POST'])
def multiPredict():
    try:
        if 'file' in request.files:
            file = request.files['file']
            # Check if the file has a permitted extension (Excel file)
            if file.filename.split('.')[-1] != 'xlsx':
                return jsonify({'error': 'Only Excel files (.xlsx) are allowed'}), 400

            # Read the Excel file
            df = pd.read_excel(file)
        else:
            json_body = request.get_json(silent=True)
            if json_body is None:
                return jsonify({'error': 'No file or JSON data provided'}), 400

            df = pd.DataFrame(json_body)

        # Check if all required fields are present in the DataFrame
        required_fields = ['index', 'email', 'gender', 'level', 'gpa_score', 'class_mode', 'study_mode', 'internet_availability']
        if not all(field in df.columns for field in required_fields):
            return jsonify({'error': 'Missing required fields in data'}), 400

        # Convert 'gpa_score' column to float
        df['gpa_score'] = df['gpa_score'].astype(float)

        # Perform predictions
        prediction_list = []
        for _, row in df.iterrows():
            # Preprocess data if necessary and make predictions
            features = [[row['gender'], row['internet_availability'], row['study_mode'], get_gpa_category(row['gpa_score'])]]
            prediction = loaded_model.predict(features)
            message = get_message(prediction, row['gpa_score'], row['internet_availability'], row['study_mode'])
            prediction_dict = {
                'index': row['index'],
                'gender': row['gender'],
                'email': row['email'],
                'class_mode' : row['class_mode'],
                'level': row['level'],
                'internet_availability': row['internet_availability'],
                'study_mode': row['study_mode'],
                'gpa_score': row['gpa_score'],
                'prediction': int(prediction[0]),
                'message': message,
            }
            prediction_list.append(prediction_dict)


        return jsonify(prediction_list)

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/predict/s', methods=['POST'])
def singlePredict():
    try:
        json_data = request.get_json(silent=True)
        if json_data is None:
            return jsonify({'error': 'No JSON data provided'}), 400

        # If the JSON data is not a list, wrap it in a list
        if not isinstance(json_data, list):
            json_data = [json_data]

        # Convert 'gpa_score' value to float
        for record in json_data:
            record['gpa_score'] = float(record['gpa_score'])

        # Perform predictions
        prediction_list = []
        for row in json_data:
            # Preprocess data if necessary and make predictions
            features = [[row['gender'], row['internet_availability'], row['study_mode'], get_gpa_category(row['gpa_score'])]]
            prediction = loaded_model.predict(features)
            message = get_message(prediction, row['gpa_score'], row['internet_availability'], row['study_mode'])
            prediction_dict = {
                'index': row.get('index', None),
                'gender': row.get('gender', None),
                'email': row.get('email', None),
                'class_mode' : row.get('class_mode', None),
                'level': row.get('level', None),
                'internet_availability': row.get('internet_availability', None),
                'study_mode': row.get('study_mode', None),
                'gpa_score': row.get('gpa_score', None),
                'prediction': int(prediction[0]),
                'message': message,
            }
            prediction_list.append(prediction_dict)

        return jsonify(prediction_list)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def send_email(receiver_email, message_content):
    # Email configuration
    sender_email = "redeemerdela419@gmail.com"  # Replace with your email address
    password = "ncxycyngzujaarsy"  # Replace with your email password
    smtp_server = "smtp.gmail.com"  # Replace with your SMTP server address
    smtp_port = 587  # Replace with your SMTP server port

    sender_name = "EduAid"

    # Create message container
    message = MIMEMultipart()
    message['From'] = f"{sender_name} <{sender_email}>"
    message['To'] = receiver_email
    message['Subject'] = "Student Academic Report"

    # Email content
    body = f"""
Dear Student,

{message_content}

Best regards,
EduAid Team
"""
    message.attach(MIMEText(body, 'plain'))

    # Establish SMTP connection
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, password)
        text = message.as_string()
        # Send email
        server.sendmail(sender_email, receiver_email, text)

    print("Email sent successfully!")

@app.route('/send-email', methods=['POST'])
def send_email_route():
    data = request.get_json()
    if 'email' in data and 'message' in data:
        email_address = data['email']
        message_content = data['message']
        send_email(email_address, message_content)
        return jsonify({'message': 'Email sent successfully'}), 200
    else:
        return jsonify({'error': 'Email address or message content not provided'}), 400



if __name__ == "__main__":
    app.run(debug=True, port=5001)
