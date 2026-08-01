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

// ==========================================
// TEAM & HACKATHON EMAILS
// ==========================================

const FOOTER = `
<br/><br/>
<hr/>
<p style="font-size: 12px; color: #666;">
  <strong>Department of Information Technology</strong><br/>
  Sona College of Technology<br/>
  For support: support-streakathon@sonatech.ac.in
</p>
`;

export async function sendInvitationEmail(params: {
  email: string;
  teamName: string;
  leaderName: string;
  hackathonName: string;
  token: string;
  expiresAt: Date;
}) {
  const { email, teamName, leaderName, hackathonName, token, expiresAt } = params;
  const acceptUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/teams/join?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a202c;">
      <h2 style="color: #2b6cb0;">You've been invited to join ${teamName}!</h2>
      <p>Hi there,</p>
      <p><strong>${leaderName}</strong> has invited you to join their team <strong>${teamName}</strong> for the upcoming <strong>${hackathonName}</strong> hackathon.</p>
      <p>This invitation will expire on ${expiresAt.toLocaleString()}.</p>
      <a href="${acceptUrl}" style="display: inline-block; background-color: #3182ce; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accept Invitation</a>
      <p>If you don't want to join this team, you can safely ignore this email.</p>
      ${FOOTER}
    </div>
  `;

  if (resend) {
    await resend.emails.send({
      from: 'hackathon@streakathon.sonatech.ac.in',
      to: email,
      subject: `Invitation to join ${teamName} at STREAKATHON`,
      html,
    });
  } else {
    console.log(`[EMAIL MOCK] To: ${email} | Subject: Invitation to ${teamName} | Link: ${acceptUrl}`);
  }
}

export async function sendRegistrationConfirmationEmail(params: {
  email: string;
  studentName: string;
  hackathonName: string;
  teamName: string;
  date: string;
  venue: string;
  registrationNumber: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a202c;">
      <h2 style="color: #2b6cb0;">Registration Confirmed!</h2>
      <p>Hi ${params.studentName},</p>
      <p>Your registration for <strong>${params.hackathonName}</strong> is confirmed.</p>
      <ul>
        <li><strong>Team:</strong> ${params.teamName}</li>
        <li><strong>Date:</strong> ${params.date}</li>
        <li><strong>Venue:</strong> ${params.venue}</li>
        <li><strong>Reg No:</strong> ${params.registrationNumber}</li>
      </ul>
      <p>Please arrive at least 30 minutes before the start time.</p>
      ${FOOTER}
    </div>
  `;

  if (resend) {
    await resend.emails.send({
      from: 'hackathon@streakathon.sonatech.ac.in',
      to: params.email,
      subject: `Registration Confirmed: ${params.hackathonName}`,
      html,
    });
  } else {
    console.log(`[EMAIL MOCK] To: ${params.email} | Subject: Registration Confirmed for ${params.hackathonName}`);
  }
}

export async function sendReminderEmail(email: string, hackathonName: string, timeRemaining: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a202c;">
      <h2 style="color: #2b6cb0;">Hackathon Reminder</h2>
      <p>Hi,</p>
      <p>This is a reminder that <strong>${hackathonName}</strong> is starting in exactly <strong>${timeRemaining}</strong>.</p>
      <p>Make sure you and your team are ready!</p>
      ${FOOTER}
    </div>
  `;
  if (resend) {
    await resend.emails.send({ from: 'hackathon@streakathon.sonatech.ac.in', to: email, subject: `Reminder: ${hackathonName} starts in ${timeRemaining}`, html });
  } else {
    console.log(`[EMAIL MOCK] To: ${email} | Subject: Reminder for ${hackathonName} (${timeRemaining})`);
  }
}

export async function sendWaitlistEmail(email: string, hackathonName: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a202c;">
      <h2 style="color: #d69e2e;">You're on the Waitlist</h2>
      <p>Hi,</p>
      <p>The <strong>${hackathonName}</strong> is currently full. We have placed you on the waiting list.</p>
      <p>If spots open up, you will be automatically promoted and notified via email.</p>
      ${FOOTER}
    </div>
  `;
  if (resend) {
    await resend.emails.send({ from: 'hackathon@streakathon.sonatech.ac.in', to: email, subject: `Waitlist: ${hackathonName}`, html });
  } else {
    console.log(`[EMAIL MOCK] To: ${email} | Subject: Waitlist for ${hackathonName}`);
  }
}
