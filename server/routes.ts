import type { Express } from "express";
import { type Server } from "http";
import nodemailer from "nodemailer";
import { generateEmailHTML } from "./email-template-generator";

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

      // Create transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Format date and time
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Generate email HTML using template
      const emailHTML = generateEmailHTML({
        name,
        email,
        subject,
        message,
        date: formattedDate,
        time: formattedTime
      });

      // Send email with beautiful HTML template
      const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `🚀 New Portfolio Contact: ${subject}`,
        html: emailHTML,
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
