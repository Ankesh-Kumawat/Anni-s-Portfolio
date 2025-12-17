import type { Express } from "express";
import { type Server } from "http";
import nodemailer from "nodemailer";

// Email configuration
// You need to set these environment variables:
// EMAIL_USER - your email address (e.g., your.email@gmail.com)
// EMAIL_PASS - your app password (for Gmail, generate from Google Account settings)
// EMAIL_TO - email where you want to receive messages (can be same as EMAIL_USER)

const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: "All fields are required"
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }

      // Check if email is configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("Contact form submission (email not configured):", {
          name,
          email,
          subject,
          message,
          timestamp: new Date().toISOString()
        });

        return res.json({
          success: true,
          message: "Message received! (Email service not configured yet)"
        });
      }

      // Send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Sent from your portfolio contact form at ${new Date().toLocaleString()}</small></p>
        `,
        replyTo: email,
      };

      await transporter.sendMail(mailOptions);

      console.log("Contact form email sent successfully:", {
        name,
        email,
        subject,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: "Message sent successfully! I'll get back to you soon."
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again later."
      });
    }
  });

  return httpServer;
}
