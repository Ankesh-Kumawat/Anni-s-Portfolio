import crypto from "crypto";

export function generateEmailHTML(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
    time: string;
}) {
    const { name, email, subject, message, date, time } = data;
    const initial = name.charAt(0).toUpperCase();

    // Use Supabase avatar URL
    const avatarUrl = "https://luozpkidddegpowqytey.supabase.co/storage/v1/object/public/avatars/avatar_1758464183262.jpg";

    // Convert message to paragraphs and lists
    const messageParagraphs = message
        .split("\n\n")
        .map((para) => {
            if (para.trim().startsWith("-")) {
                const items = para
                    .split("\n")
                    .filter((line) => line.trim().startsWith("-"));
                const listItems = items
                    .map(
                        (item) =>
                            `<tr><td style="padding: 5px 0 5px 20px; color: #e7d4b5; font-size: 14px; line-height: 1.7;">• ${item.replace(/^-\s*/, "")}</td></tr>`
                    )
                    .join("");
                return `<table cellpadding="0" cellspacing="0" style="margin: 0 0 14px 0;">${listItems}</table>`;
            }
            return `<p style="margin: 0 0 14px 0; color: #e7d4b5; font-size: 14px; line-height: 1.7;">${para.replace(/\n/g, "<br>")}</p>`;
        })
        .join("");

    const firstName = name.split(" ")[0];

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: transparent;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: transparent; padding: 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #3a2f28; border: 1px solid #f97316; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #f97316;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #fef3c7; letter-spacing: -0.025em;">
                      New Contact Message
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #d4a574;">
                      Someone reached out through your portfolio
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 24px;">
              
              <!-- Profile Card -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #4a3a30; border: 1px solid #f97316; border-radius: 8px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 20px;">
                    
                    <!-- Profile Header -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                      <tr>
                        <td width="64" valign="top" style="padding-right: 16px;">
                          <!-- Avatar with Gravatar -->
                          <table cellpadding="0" cellspacing="0" border="0" width="64" height="64" style="border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);">
                            <tr>
                              <td align="center" valign="middle">
                                <img src="${avatarUrl}" alt="${name}" width="64" height="64" style="display: block; border-radius: 50%; border: 2px solid #f97316;" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=&quot;color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;&quot;>${initial}</span>';" />
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td valign="top">
                          <!-- Name -->
                          <div style="font-size: 18px; font-weight: 600; color: #fef3c7; margin-bottom: 6px; letter-spacing: -0.025em;">
                            ${name}
                          </div>
                          <!-- Email -->
                          <div style="font-size: 14px; color: #d4a574; margin-bottom: 10px;">
                            <a href="mailto:${email}" style="color: #d4a574; text-decoration: none;">
                              ${email}
                            </a>
                          </div>
                          <!-- Subject Badge -->
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background-color: rgba(249, 115, 22, 0.2); border: 1px solid #f97316; border-radius: 6px; padding: 6px 12px;">
                                <span style="font-size: 13px; color: #fdba74; font-weight: 500;">
                                  ${subject}
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Meta Info -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 16px; border-top: 1px solid rgba(249, 115, 22, 0.3);">
                      <tr>
                        <td style="font-size: 13px; color: #fdba74; padding-right: 24px;">
                          ${date}
                        </td>
                        <td style="font-size: 13px; color: #fdba74;">
                          ${time}
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
              </table>
              
              <!-- Message Card -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #4a3a30; border: 1px solid #f97316; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #fef3c7; letter-spacing: -0.025em;">
                      Message
                    </h3>
                    <div style="text-align: left;">
                      ${messageParagraphs}
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Reply Button -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); border-radius: 6px; box-shadow: 0 2px 4px 0 rgba(249, 115, 22, 0.4);">
                    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; padding: 10px 24px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: -0.025em;">
                      Reply to ${firstName}
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 24px; border-top: 1px solid #f97316; text-align: center; font-size: 13px; color: #d4a574;">
              Portfolio Contact Form • Sent via your website
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
