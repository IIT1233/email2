const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Middleware to parse POST bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Route handling
app.post('/send', (req, res) => {
    const to = req.body.to;
    const subject = req.body.subject;
    const message = req.body.message;
    const from = req.body.from;
    const name = req.body.name;

    // Validate email inputs
    if (!(validateEmail(to) && validateEmail(from))) {
        res.send("Email address inputs invalid");
        return;
    }

    // Create transporter for sending email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Your email account
            pass: 'your-password' // Your email account password
        }
    });

    // Construct email headers
    const mailOptions = {
        from: `"${name}" <${from}>`,
        to: to,
        subject: subject,
        html: message
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email did not send. Error:", error);
            res.send("Email did not send. Error: " + error);
        } else {
            console.log("Email sent: " + info.response);
            res.send("Email sent.");
        }
    });
});

// Serve the HTML form
app.get('/', (req, res) => {
    const html = `
        <html>
            <head>
                <style>
                    input[type=submit] {
                        background-color: #4CAF50;
                        border: none;
                        color: white;
                        padding: 14px 32px;
                        text-decoration: none;
                        margin: 4px 2px;
                        cursor: pointer;
                        font-size: 16px;
                    }
                </style>
            </head>
            <body>
                <h2>Spoof Email</h2>
                <form action="/send" method="post" id="emailform">
                    <label for="to">To:</label><br>
                    <input type="text" id="to" name="to"><br><br>
                    <label for="from">From:</label><br>
                    <input type="text" id="from" name="from"><br><br>
                    <label for="name">Name (optional):</label><br>
                    <input type="text" id="name" name="name"><br><br>
                    <label for="subject">Subject:</label><br>
                    <input type="text" id="subject" name="subject"><br><br>
                    <label for="message">Message [HTML is supported]:</label><br>
                    <textarea rows="6" cols="50" name="message" form="emailform"></textarea><br><br>
                    <input type="submit" value="Submit">
                </form>
                <p>An e-mail will be sent to the desired target with a spoofed From header when you click Submit.</p>
            </body>
        </html>
    `;
    res.send(html);
});

// Validate email function
function validateEmail(email) {
    // Basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
