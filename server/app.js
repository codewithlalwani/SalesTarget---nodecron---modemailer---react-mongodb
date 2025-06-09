// 🧠 Smart Scheduled Mailing System by Yash Lalwani

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require("node-cron");

const app = express();
const port = 5000;

mongoose.connect("mongodb://127.0.0.1:27017/emailLogs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

const emailLogSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  subject: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  status: String,
  error: String,
});

const EmailLog = mongoose.model("EmailLog", emailLogSchema);

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

function sendEmail({ recipient_email, subject, message }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "yashlalwani661@gmail.com",
        pass: "mcsvdhzhpuggnert", // NOTE: Use env variable in production
      },
    });

    const mail_configs = {
      from: '"SalesTarget.ai" <yashlalwani661@gmail.com>',
      to: recipient_email,
      subject: subject || "No Subject Provided",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #00466a;">${subject}</h2>
          <p>${message}</p>
          <hr />
          <p style="font-size: 12px; color: #888;">Welcome to SalesTarget.ai</p>
        </div>
      `,
    };

    transporter.sendMail(mail_configs, async (error, info) => {
      const log = new EmailLog({
        sender: "yashlalwani661@gmail.com",
        recipient: recipient_email,
        subject: subject || "No Subject Provided",
        message: message,
        status: error ? "failed" : "success",
        error: error ? error.toString() : null,
      });

      try {
        await log.save();
        console.log(`📨 Email log saved for ${recipient_email}`);
      } catch (err) {
        console.error("❌ Failed to save email log:", err);
      }

      if (error) {
        console.log(`❌ Send failed for ${recipient_email}:`, error);
        return reject({ message: "An error occurred while sending email." });
      }

      console.log(`✅ Email sent to ${recipient_email}:`, info.response);
      return resolve({ message: "Email sent and logged successfully!" });
    });
  });
}

// 🚀 Main Route for Sending Manual Email
app.post("/send_email", (req, res) => {
  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

// 📜 Route to Fetch Logs
app.get("/email_logs", async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).send("Error fetching logs");
  }
});


// ⏰ Schedule: Send Daily Email at 9 AM to Unique Recipients
cron.schedule("0 9 * * *", async () => {
  console.log("📅 Scheduled task triggered: Sending daily emails to all unique recipients");

  try {
    const uniqueRecipients = await EmailLog.distinct("recipient");

    for (const email of uniqueRecipients) {
      const subject = "⏰ Daily Digest from SalesTarget.ai";
      const message = `
        Hello,<br><br>
        This is your automated daily digest from <strong>SalesTarget.ai</strong>.<br>
        Stay focused and make the most of your day. 💪<br><br>
        — Team SalesTarget.ai
      `;

      await sendEmail({ recipient_email: email, subject, message });
    }

    console.log(`📬 Sent daily emails to ${uniqueRecipients.length} unique recipients.`);
  } catch (err) {
    console.error("❌ Error during scheduled email job:", err);
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
