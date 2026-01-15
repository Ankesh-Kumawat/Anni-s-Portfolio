import type { EditorData } from "../types";

// Define percentage weights for each field in each step
export const FIELD_WEIGHTS = {
  step1: {
    name: 20,           // Required - 20%
    title: 10,          // Required - 10%
    location: 15,       // Required - 15%
    bio: 20,            // Required - 20%
    avatar: 20,         // Required - 20%
    skills: 15,         // Required - 15%
    // Total: 100%
  },
  step2: {
    email: 40,          // Required - 40%
    location: 30,       // Required - 30%
    message: 15,        // Optional - 15%
    copyright: 15,      // Optional - 15%
    // Total: 100%
  },
  step3: {
    // Dynamic: Each link with URL = (100 / total links)
    // If no links added, 0%
  },
  step4: {
    // Dynamic: Each project with name & description = (100 / total projects)
    // If no projects added, 0%
  },
  step5: {
    // Dynamic: Each note with title & content = (100 / total notes)
    // If no notes added, 0%
  },
  step6: {
    terminalUsername: 11,    // 11%
    terminalRole: 11,        // 11%
    terminalSkills: 11,      // 11%
    databaseName: 11,        // 11%
    databaseEmail: 11,       // 11%
    databaseRole: 11,        // 11%
    settingsName: 11,        // 11%
    settingsRole: 11,        // 11%
    settingsAvatar: 12,      // 12%
    // Total: 100%
  }
};

/**
 * Calculate Step 1 (Personal Info) completion percentage
 */
export function calculateStep1Completion(data: EditorData): number {
  let percentage = 0;
  
  if (data.about.personal.name) {
    percentage += FIELD_WEIGHTS.step1.name;
  }
  
  if (data.about.personal.title) {
    percentage += FIELD_WEIGHTS.step1.title;
  }
  
  if (data.about.personal.location) {
    percentage += FIELD_WEIGHTS.step1.location;
  }
  
  if (data.about.personal.bio) {
    percentage += FIELD_WEIGHTS.step1.bio;
  }
  
  if (data.about.personal.avatar) {
    percentage += FIELD_WEIGHTS.step1.avatar;
  }
  
  if (data.about.skills.length > 0) {
    percentage += FIELD_WEIGHTS.step1.skills;
  }
  
  return Math.round(percentage);
}

/**
 * Calculate Step 2 (Contact) completion percentage
 */
export function calculateStep2Completion(data: EditorData): number {
  let percentage = 0;
  
  if (data.contact.email) {
    percentage += FIELD_WEIGHTS.step2.email;
  }
  
  if (data.contact.location) {
    percentage += FIELD_WEIGHTS.step2.location;
  }
  
  if (data.contact.message) {
    percentage += FIELD_WEIGHTS.step2.message;
  }
  
  if (data.contact.copyright) {
    percentage += FIELD_WEIGHTS.step2.copyright;
  }
  
  return Math.round(percentage);
}

/**
 * Calculate Step 3 (Social Links) completion percentage
 */
export function calculateStep3Completion(data: EditorData): number {
  const totalLinks = data.social.links.length;
  
  if (totalLinks === 0) {
    return 0;
  }
  
  const filledLinks = data.social.links.filter(link => link.url && link.url.trim() !== '').length;
  const percentage = (filledLinks / totalLinks) * 100;
  
  return Math.round(percentage);
}

/**
 * Calculate Step 4 (Projects) completion percentage
 */
export function calculateStep4Completion(data: EditorData): number {
  const totalProjects = data.projects.projects.length;
  
  if (totalProjects === 0) {
    return 0;
  }
  
  const filledProjects = data.projects.projects.filter(
    project => project.name && project.name.trim() !== '' && 
               project.description && project.description.trim() !== ''
  ).length;
  
  const percentage = (filledProjects / totalProjects) * 100;
  
  return Math.round(percentage);
}

/**
 * Calculate Step 5 (Notepad) completion percentage
 */
export function calculateStep5Completion(data: EditorData): number {
  const totalNotes = data.notepad.defaultNotes.length;
  
  if (totalNotes === 0) {
    return 0;
  }
  
  const filledNotes = data.notepad.defaultNotes.filter(
    note => note.title && note.title.trim() !== '' && 
            note.content && note.content.trim() !== ''
  ).length;
  
  const percentage = (filledNotes / totalNotes) * 100;
  
  return Math.round(percentage);
}

/**
 * Calculate Step 6 (Advanced Settings) completion percentage
 */
export function calculateStep6Completion(data: EditorData): number {
  let percentage = 0;
  
  // Terminal fields
  if (data.terminal.username) {
    percentage += FIELD_WEIGHTS.step6.terminalUsername;
  }
  
  if (data.terminal.userRole) {
    percentage += FIELD_WEIGHTS.step6.terminalRole;
  }
  
  if (data.terminal.skills.technical.length > 0) {
    percentage += FIELD_WEIGHTS.step6.terminalSkills;
  }
  
  // Database fields
  if (data.database.user.name) {
    percentage += FIELD_WEIGHTS.step6.databaseName;
  }
  
  if (data.database.user.email) {
    percentage += FIELD_WEIGHTS.step6.databaseEmail;
  }
  
  if (data.database.user.role) {
    percentage += FIELD_WEIGHTS.step6.databaseRole;
  }
  
  // Settings fields
  if (data.settings.account.name) {
    percentage += FIELD_WEIGHTS.step6.settingsName;
  }
  
  if (data.settings.account.role) {
    percentage += FIELD_WEIGHTS.step6.settingsRole;
  }
  
  if (data.settings.account.avatar) {
    percentage += FIELD_WEIGHTS.step6.settingsAvatar;
  }
  
  return Math.round(percentage);
}

/**
 * Calculate overall completion percentage (average of all steps)
 */
export function calculateOverallCompletion(data: EditorData): number {
  const step1 = calculateStep1Completion(data);
  const step2 = calculateStep2Completion(data);
  const step3 = calculateStep3Completion(data);
  const step4 = calculateStep4Completion(data);
  const step5 = calculateStep5Completion(data);
  const step6 = calculateStep6Completion(data);
  const step7 = 100; // Review step is always complete
  
  const average = (step1 + step2 + step3 + step4 + step5 + step6 + step7) / 7;
  
  return Math.round(average);
}

/**
 * Get detailed field completion status for Step 1
 */
export function getStep1FieldStatus(data: EditorData) {
  return {
    name: { filled: !!data.about.personal.name, weight: FIELD_WEIGHTS.step1.name },
    title: { filled: !!data.about.personal.title, weight: FIELD_WEIGHTS.step1.title },
    location: { filled: !!data.about.personal.location, weight: FIELD_WEIGHTS.step1.location },
    bio: { filled: !!data.about.personal.bio, weight: FIELD_WEIGHTS.step1.bio },
    avatar: { filled: !!data.about.personal.avatar, weight: FIELD_WEIGHTS.step1.avatar },
    skills: { filled: data.about.skills.length > 0, weight: FIELD_WEIGHTS.step1.skills },
  };
}

/**
 * Get detailed field completion status for Step 2
 */
export function getStep2FieldStatus(data: EditorData) {
  return {
    email: { filled: !!data.contact.email, weight: FIELD_WEIGHTS.step2.email },
    location: { filled: !!data.contact.location, weight: FIELD_WEIGHTS.step2.location },
    message: { filled: !!data.contact.message, weight: FIELD_WEIGHTS.step2.message },
    copyright: { filled: !!data.contact.copyright, weight: FIELD_WEIGHTS.step2.copyright },
  };
}
