import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

      // Here you can:
      // 1. Save to database
      // 2. Send email using nodemailer
      // 3. Send to a third-party service
      // For now, we'll just log it and return success

      console.log("Contact form submission:", {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
      });

      // TODO: Implement email sending with nodemailer
      // or save to database using storage

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
