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

def get_message(prediction, gpa_score, internet_availability, study_mode):
    if prediction == 0:
        return f"High probability of success: Based on the analysis of the student's data, including their GPA of {gpa_score}, which is considered good, along with the presence of a {internet_availability} internet network and their choice of a practical {study_mode} mode, there is a high probability that the student can achieve excellent results. With consistent dedication and hard work, the student has the potential to attain a first-class degree if they continue to study diligently."
    elif prediction == 1:
        return f"Promising probability of success: With a commendable GPA of {gpa_score}, indicative of strong academic performance, complemented by {internet_availability} internet access and an engaging {study_mode} study mode, the student's prospects for success are promising. By maintaining their current level of dedication and continuing to actively engage in their studies, the student is well-positioned to achieve notable academic accomplishments and realize their educational goals."
    elif prediction == 2:
        return f"Moderate probability of success: Considering the student's GPA of {gpa_score}, which indicates a satisfactory academic performance, coupled with a {internet_availability} internet connection and a conventional {study_mode} study mode, there exists a moderate likelihood of achieving success. With concerted effort and dedication, the student has the potential to improve their academic standing and enhance their prospects for success."
    elif prediction == 3:
        return f"Low probability of success: Despite efforts, the student's GPA of {gpa_score} suggests challenges in academic performance. Coupled with {internet_availability} internet access and a passive {study_mode} study mode, the likelihood of achieving success is low. However, with personalized support, targeted interventions, and a commitment to academic improvement, the student can overcome obstacles and work towards enhancing their academic standing."
    elif prediction == 4:
        return f"Very low probability of success: The student's GPA of {gpa_score} reflects significant academic struggles, indicating substantial room for improvement. Combined with {internet_availability} internet availability and a passive {study_mode} study mode, the likelihood of achieving success is very low. However, with dedicated support, tailored educational interventions, and a proactive approach to learning, the student can embark on a path towards academic improvement and strive to overcome existing challenges"
    else:
        return "Unknown prediction"

@app.route('/predict', methods=['POST'])
def multiPredict():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        # Check if the file has a permitted extension (Excel file)
        if file.filename.split('.')[-1] != 'xlsx':
            return jsonify({'error': 'Only Excel files (.xlsx) are allowed'}), 400

        # Read the Excel file
        df = pd.read_excel(file)

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
            prediction = loaded_model.predict([[row['gender'], row['internet_availability'], row['study_mode'], get_gpa_category(row['gpa_score'])]])
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


def send_email(receiver_email):
    # Email configuration
    sender_email = "redeemerdela419@gmail.com"  # Replace with your email address
    password = "ncxycyngzujaarsy"  # Replace with your email password
    smtp_server = "smtp.gmail.com"  # Replace with your SMTP server address
    smtp_port = 587  # Replace with your SMTP server port

    # Create message container
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = "Subject of the Email"

    # Email content
    body = "This is the body of the email."
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
    if 'email' in data:
        email_address = data['email']
        send_email(email_address)
        return jsonify({'message': 'Email sent successfully'}), 200
    else:
        return jsonify({'error': 'Email address not provided'}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5001)
