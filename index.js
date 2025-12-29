require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BREVO_API_KEY = process.env.BREVO_API_KEY;
console.log("BREVO_API_KEY:", BREVO_API_KEY ? "LOADED" : "MISSING");

app.post("/send-otp", async (req, res) => {
  console.log("REQUEST BODY:", req.body);

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "email and otp required"
    });
  }

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "EcoVision",
          email: "ecovision.app.mobile@gmail.com"
        },
        to: [{ email }],
        subject: "Your EcoVision OTP Code",
        htmlContent: `<h1>${otp}</h1><p>This code expires in 10 minutes.</p>`
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true });

  } catch (error) {
    console.error("Brevo error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ EcoVision OTP server running on port ${PORT}`);
});


