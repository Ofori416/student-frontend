const nodemailer = require('nodemailer');

// Function to send an email
const sendEmail = async (emailAddress) => {
    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Change to your email service provider
        auth: {
            user: 'redeemerdela419@gmail.com', // Replace with your email address
            pass: 'ncxycyngzujaarsy' // Replace with your email password or app password
        }
    });

    // Email content
    let mailOptions = {
        from: 'your_email@gmail.com', // Replace with your email address
        to: emailAddress, // Recipient's email address
        subject: 'Subject of the Email',
        text: 'This is the body of the email.'
    };

    try {
        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return 'Email sent successfully!';
    } catch (error) {
        console.error('Error sending email:', error);
        return 'Failed to send email.';
    }
};

// // Example usage
// sendEmail('recipient@example.com');
