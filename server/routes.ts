import type { Express } from "express";
import { type Server } from "http";
import nodemailer from "nodemailer";

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
        month: 'long',
        day: 'numeric'
      });
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Send email with beautiful HTML template
      const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `🚀 New Portfolio Contact: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
              .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
              .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; }
              .content { padding: 30px; }
              .info-card { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px 20px; margin-bottom: 20px; border-radius: 6px; }
              .info-card .label { font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 5px; }
              .info-card .value { font-size: 16px; color: #333; font-weight: 500; }
              .message-box { background: #ffffff; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }
              .message-box h3 { margin: 0 0 15px 0; color: #667eea; font-size: 18px; }
              .message-box p { margin: 0; color: #555; white-space: pre-wrap; word-wrap: break-word; }
              .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef; }
              .footer p { margin: 5px 0; font-size: 13px; color: #6c757d; }
              .reply-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 15px 0; font-weight: 600; }
              .timestamp { display: flex; justify-content: space-between; padding: 15px 30px; background: #f8f9fa; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💼 New Contact Message</h1>
                <p>Someone reached out through your portfolio</p>
              </div>
              
              <div class="content">
                <div class="info-card">
                  <div class="label">👤 From</div>
                  <div class="value">${name}</div>
                </div>
                
                <div class="info-card">
                  <div class="label">📧 Email Address</div>
                  <div class="value"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></div>
                </div>
                
                <div class="info-card">
                  <div class="label">📝 Subject</div>
                  <div class="value">${subject}</div>
                </div>
                
                <div class="message-box">
                  <h3>💬 Message</h3>
                  <p>${message.replace(/\n/g, '<br>')}</p>
                </div>
                
                <center>
                  <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="reply-button">
                    ↩️ Reply to ${name.split(' ')[0]}
                  </a>
                </center>
              </div>
              
              <div class="timestamp">
                <span>📅 ${formattedDate}</span>
                <span>🕐 ${formattedTime}</span>
              </div>
              
              <div class="footer">
                <p><strong>Portfolio Contact Form</strong></p>
                <p>This message was sent from your portfolio website contact form</p>
              </div>
            </div>
          </body>
          </html>
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
