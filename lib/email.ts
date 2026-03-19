export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  if (process.env.EMAIL_MODE === "log") {
    console.log("=".repeat(60));
    console.log("📧 EMAIL VERIFICATION (LOG MODE)");
    console.log("=".repeat(60));
    console.log(`To: ${email}`);
    console.log(`Subject: Verify your email - Valix`);
    console.log(`Verification URL: ${verifyUrl}`);
    console.log("=".repeat(60));
    return;
  }

  const nodemailer = (await import("nodemailer")).default;
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Valix" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email - Valix",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; }
            .footer { margin-top: 30px; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Valix!</h1>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <p style="margin: 30px 0;">
              <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Verify Email</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${verifyUrl}</p>
            <div class="footer">
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export default null;
