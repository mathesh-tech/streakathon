export const StoneBlueTheme = {
  primary: "#1e3a8a", // tailwind blue-900
  secondary: "#3b82f6", // tailwind blue-500
  accent: "#dbeafe", // tailwind blue-100
  text: "#1f2937", // tailwind gray-800
  textLight: "#6b7280", // tailwind gray-500
  background: "#f3f4f6", // tailwind gray-100
  white: "#ffffff",
};

const FOOTER = `
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: ${StoneBlueTheme.textLight}; font-size: 12px; font-family: 'Inter', Arial, sans-serif;">
    <p style="margin: 0 0 10px 0;">
      <strong>Department of Information Technology</strong><br/>
      Sona College of Technology, Salem
    </p>
    <p style="margin: 0 0 10px 0;">
      <a href="https://streakathon.sonatech.ac.in" style="color: ${StoneBlueTheme.secondary}; text-decoration: none;">Website</a> | 
      <a href="mailto:support-streakathon@sonatech.ac.in" style="color: ${StoneBlueTheme.secondary}; text-decoration: none;">Contact Support</a>
    </p>
    <p style="margin: 0;">© ${new Date().getFullYear()} STREAKATHON. All rights reserved.</p>
  </div>
`;

function BaseTemplate(title: string, body: string, actionText?: string, actionUrl?: string) {
  return `
    <div style="background-color: ${StoneBlueTheme.background}; padding: 40px 20px; font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: ${StoneBlueTheme.text};">
      <div style="max-w-width: 600px; margin: 0 auto; background-color: ${StoneBlueTheme.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        
        <!-- Header -->
        <div style="background-color: ${StoneBlueTheme.primary}; padding: 30px; text-align: center;">
          <h1 style="color: ${StoneBlueTheme.white}; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">STREAKATHON</h1>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">
          <h2 style="color: ${StoneBlueTheme.primary}; font-size: 20px; margin-top: 0;">${title}</h2>
          
          <div style="font-size: 16px; color: ${StoneBlueTheme.text};">
            ${body}
          </div>

          ${
            actionText && actionUrl
              ? `
            <div style="margin-top: 30px; text-align: center;">
              <a href="${actionUrl}" style="display: inline-block; background-color: ${StoneBlueTheme.secondary}; color: ${StoneBlueTheme.white}; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                ${actionText}
              </a>
            </div>
          `
              : ""
          }
          
          ${FOOTER}
        </div>
      </div>
    </div>
  `;
}

export const EmailTemplates = {
  LoginAlert: (name: string, ip: string, browser: string, os: string, time: string, isSuspicious: boolean) => {
    const title = isSuspicious ? "⚠️ Suspicious Login Detected" : "New Login to Your Account";
    const body = `
      <p>Hi ${name},</p>
      <p>${isSuspicious ? "We detected a login from an unrecognized device." : "We noticed a new login to your STREAKATHON account."}</p>
      <div style="background-color: ${StoneBlueTheme.accent}; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
        <p style="margin: 5px 0;"><strong>IP Address:</strong> ${ip}</p>
        <p style="margin: 5px 0;"><strong>Browser:</strong> ${browser}</p>
        <p style="margin: 5px 0;"><strong>OS:</strong> ${os}</p>
      </div>
      ${isSuspicious ? `<p style="color: #ef4444; font-weight: bold;">If this wasn't you, please reset your password immediately.</p>` : ""}
    `;
    return BaseTemplate(title, body);
  },

  Verification: (name: string, url: string) => {
    const body = `
      <p>Hi ${name},</p>
      <p>Welcome to STREAKATHON! Please verify your email address to complete your registration and secure your account.</p>
    `;
    return BaseTemplate("Verify Your Email", body, "Verify Email Address", url);
  },

  TeamInvitation: (name: string, teamName: string, hackathonName: string, leaderName: string, url: string) => {
    const body = `
      <p>Hi ${name},</p>
      <p><strong>${leaderName}</strong> has invited you to join their team <strong>${teamName}</strong> for <strong>${hackathonName}</strong>.</p>
      <p>Accept the invitation before it expires to secure your spot!</p>
    `;
    return BaseTemplate(`You're Invited to ${teamName}!`, body, "Accept Invitation", url);
  },

  RegistrationSuccess: (name: string, hackathonName: string, teamName: string, regNumber: string, date: string, venue: string) => {
    const body = `
      <p>Hi ${name},</p>
      <p>Your registration for <strong>${hackathonName}</strong> is fully confirmed.</p>
      <div style="background-color: ${StoneBlueTheme.accent}; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Registration No:</strong> ${regNumber}</p>
        <p style="margin: 5px 0;"><strong>Team:</strong> ${teamName}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
        <p style="margin: 5px 0;"><strong>Venue:</strong> ${venue}</p>
      </div>
      <p>Please arrive at least 30 minutes early.</p>
    `;
    return BaseTemplate("Registration Confirmed", body);
  },

  GenericAnnouncement: (title: string, message: string, url?: string, actionText?: string) => {
    return BaseTemplate(title, `<p>${message.replace(/\n/g, '<br/>')}</p>`, actionText, url);
  },
  
  CreditUpdate: (name: string, oldCredits: number, newCredits: number, reason: string, url: string) => {
    const isIncrease = newCredits > oldCredits;
    const diff = Math.abs(newCredits - oldCredits);
    const body = `
      <p>Hi ${name},</p>
      <p>Your Innovation Credits have been updated!</p>
      <div style="background-color: ${StoneBlueTheme.accent}; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
        <span style="font-size: 24px; font-weight: bold; color: ${isIncrease ? '#16a34a' : '#dc2626'};">
          ${isIncrease ? '+' : '-'}${diff} Credits
        </span>
        <p style="margin: 10px 0 0 0;"><strong>New Balance:</strong> ${newCredits}</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: ${StoneBlueTheme.textLight};">Reason: ${reason}</p>
      </div>
    `;
    return BaseTemplate("Innovation Credits Updated", body, "View Leaderboard", url);
  }
};
