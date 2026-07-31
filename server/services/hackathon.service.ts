import { HackathonRepository } from "../repositories/hackathon.repository";

export class HackathonService {
  /**
   * BUSINESS RULE: REGISTRATION WINDOW
   * Wednesday 09:00 AM to Friday 12:00 PM
   */
  static isRegistrationOpen(hackathon: any, adminOverride = false): boolean {
    if (adminOverride) return true;
    if (!hackathon) return false;

    const now = new Date();
    const openTime = new Date(hackathon.registrationOpen);
    const closeTime = new Date(hackathon.registrationClose);

    return now >= openTime && now <= closeTime;
  }

  /**
   * BUSINESS RULE: PROBLEM STATEMENT VISIBILITY
   * Visible only after Saturday 10:00 AM
   */
  static canViewProblemStatement(hackathon: any): boolean {
    if (!hackathon) return false;
    
    const now = new Date();
    const releaseTime = new Date(hackathon.problemReleaseTime);
    
    return now >= releaseTime;
  }

  /**
   * BUSINESS RULE: SUBMISSION WINDOW
   * Only before deadline. Late disabled.
   */
  static canSubmit(hackathon: any): boolean {
    if (!hackathon) return false;

    const now = new Date();
    const deadline = new Date(hackathon.submissionDeadline);

    return now <= deadline;
  }
}
