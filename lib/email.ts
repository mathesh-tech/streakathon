import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendSecurityEmail(params: {
  email: string;
  name: string;
  ipAddress: string;
  browser: string;
  os: string;
  isSuspicious: boolean;
}) {
  const { email, name, ipAddress, browser, os, isSuspicious } = params;

  let subject = "New login to your STREAKATHON account";
  let content = `Hi ${name},\n\nWe noticed a new login to your account.\n\nDetails:\n- IP Address: ${ipAddress}\n- Browser: ${browser}\n- OS: ${os}`;

  if (isSuspicious) {
    subject = "⚠️ Suspicious login detected on your STREAKATHON account";
    content = `Hi ${name},\n\nThis doesn't look like your usual device — was this you?\n\nDetails:\n- IP Address: ${ipAddress}\n- Browser: ${browser}\n- OS: ${os}\n\nIf this wasn't you, please reset your password immediately.`;
  }

  if (resend) {
    await resend.emails.send({
      from: 'security@streakathon.sonatech.ac.in', // Configure verified domain here
      to: email,
      subject,
      text: content,
    });
  } else {
    // Fallback if no API key is provided
    console.log(`[EMAIL MOCK] To: ${email} | Subject: ${subject}`);
    console.log(content);
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  
  const content = `Please verify your STREAKATHON account by clicking the following link:\n\n${verificationUrl}`;
  
  if (resend) {
    await resend.emails.send({
      from: 'noreply@streakathon.sonatech.ac.in',
      to: email,
      subject: "Verify your STREAKATHON account",
      text: content,
    });
  } else {
    console.log(`[EMAIL MOCK] To: ${email} | Verify Link: ${verificationUrl}`);
  }
}

export async function sendTemporaryPasswordEmail(email: string, tempPassword: string) {
  const content = `Your STREAKATHON account has been created.\n\nYour temporary password is: ${tempPassword}\n\nPlease log in and change your password immediately.`;
  
  if (resend) {
    await resend.emails.send({
      from: 'admin@streakathon.sonatech.ac.in',
      to: email,
      subject: "Your STREAKATHON Account Credentials",
      text: content,
    });
  } else {
    console.log(`[EMAIL MOCK] To: ${email} | Temp Password: ${tempPassword}`);
  }
}
