const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'harishahi592@gmail.com',
        pass: 'your-app-password' // Use app password for Gmail
    }
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message, website } = req.body;

        // Honeypot check
        if (website) {
            return res.status(400).json({ success: false, error: 'Spam detected' });
        }

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        if (!email.includes('@')) {
            return res.status(400).json({ success: false, error: 'Invalid email address' });
        }

        if (message.length < 10) {
            return res.status(400).json({ success: false, error: 'Message must be at least 10 characters' });
        }

        // Email content
        const mailOptions = {
            from: 'Portfolio Contact <noreply@yourdomain.com>',
            to: 'harishahi592@gmail.com',
            subject: `[Portfolio Contact] ${subject}`,
            text: `You have a new message from your portfolio contact form.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent at: ${new Date().toLocaleString()}
IP Address: ${req.ip || req.connection.remoteAddress}`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
    }
});

// Serve the main website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Contact form endpoint: http://localhost:${PORT}/contact`);
});
