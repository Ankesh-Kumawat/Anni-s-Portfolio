import { db } from "./firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy 
} from "firebase/firestore";

// Collections
const COLLECTIONS = {
  ABOUT: "about",
  PROJECTS: "projects",
  CONTACT: "contact",
  SOCIAL: "social",
  GALLERY: "gallery",
  NOTEPAD: "notepad",
  TERMINAL: "terminal",
  DATABASE: "database",
  SETTINGS: "settings",
  BROWSER: "browser",
  MUSIC: "music",
  YOUTUBE: "youtube",
  PREFERENCES: "preferences"
};

// Generic CRUD operations
export async function getDocument(collectionName: string, docId: string = "main") {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

export async function setDocument(collectionName: string, data: any, docId: string = "main") {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, data, { merge: true });
}

export async function updateDocument(collectionName: string, data: any, docId: string = "main") {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
}

export async function deleteDocument(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

export async function getCollection(collectionName: string) {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Specific data fetchers
export async function getAboutData() {
  return await getDocument(COLLECTIONS.ABOUT);
}

export async function getProjectsData() {
  return await getDocument(COLLECTIONS.PROJECTS);
}

export async function getContactData() {
  return await getDocument(COLLECTIONS.CONTACT);
}

export async function getSocialData() {
  return await getDocument(COLLECTIONS.SOCIAL);
}

export async function getGalleryData() {
  return await getDocument(COLLECTIONS.GALLERY);
}

export async function getNotepadData() {
  return await getDocument(COLLECTIONS.NOTEPAD);
}

export async function getTerminalData() {
  return await getDocument(COLLECTIONS.TERMINAL);
}

export async function getDatabaseData() {
  return await getDocument(COLLECTIONS.DATABASE);
}

export async function getSettingsData() {
  return await getDocument(COLLECTIONS.SETTINGS);
}

export async function getBrowserData() {
  return await getDocument(COLLECTIONS.BROWSER);
}

export async function getMusicData() {
  return await getDocument(COLLECTIONS.MUSIC);
}

export async function getYouTubeData() {
  return await getDocument(COLLECTIONS.YOUTUBE);
}

export async function getPreferencesData() {
  return await getDocument(COLLECTIONS.PREFERENCES);
}

// Specific data setters
export async function saveAboutData(data: any) {
  await setDocument(COLLECTIONS.ABOUT, data);
}

export async function saveProjectsData(data: any) {
  await setDocument(COLLECTIONS.PROJECTS, data);
}

export async function saveContactData(data: any) {
  await setDocument(COLLECTIONS.CONTACT, data);
}

export async function saveSocialData(data: any) {
  await setDocument(COLLECTIONS.SOCIAL, data);
}

export async function saveGalleryData(data: any) {
  await setDocument(COLLECTIONS.GALLERY, data);
}

export async function saveNotepadData(data: any) {
  await setDocument(COLLECTIONS.NOTEPAD, data);
}

export async function saveTerminalData(data: any) {
  await setDocument(COLLECTIONS.TERMINAL, data);
}

export async function saveDatabaseData(data: any) {
  await setDocument(COLLECTIONS.DATABASE, data);
}

export async function saveSettingsData(data: any) {
  await setDocument(COLLECTIONS.SETTINGS, data);
}

export async function saveBrowserData(data: any) {
  await setDocument(COLLECTIONS.BROWSER, data);
}

export async function saveMusicData(data: any) {
  await setDocument(COLLECTIONS.MUSIC, data);
}

export async function saveYouTubeData(data: any) {
  await setDocument(COLLECTIONS.YOUTUBE, data);
}

export async function savePreferencesData(data: any) {
  await setDocument(COLLECTIONS.PREFERENCES, data);
}

// Save all data at once
export async function saveAllData(data: any) {
  const promises = [
    saveAboutData(data.about),
    saveProjectsData(data.projects),
    saveContactData(data.contact),
    saveSocialData(data.social),
    saveGalleryData(data.gallery),
    saveNotepadData(data.notepad),
    saveTerminalData(data.terminal),
    saveDatabaseData(data.database),
    saveSettingsData(data.settings),
    saveBrowserData(data.browser),
    saveMusicData(data.music),
    saveYouTubeData(data.youtube),
    savePreferencesData(data.preferences)
  ];
  
  await Promise.all(promises);
}

// Get all data at once
export async function getAllData() {
  const [
    about,
    projects,
    contact,
    social,
    gallery,
    notepad,
    terminal,
    database,
    settings,
    browser,
    music,
    youtube,
    preferences
  ] = await Promise.all([
    getAboutData(),
    getProjectsData(),
    getContactData(),
    getSocialData(),
    getGalleryData(),
    getNotepadData(),
    getTerminalData(),
    getDatabaseData(),
    getSettingsData(),
    getBrowserData(),
    getMusicData(),
    getYouTubeData(),
    getPreferencesData()
  ]);

  return {
    about,
    projects,
    contact,
    social,
    gallery,
    notepad,
    terminal,
    database,
    settings,
    browser,
    music,
    youtube,
    preferences
  };
}

// Tech Stack Management
const TECH_STACK_COLLECTION = "techStacks";

export async function getTechStacks() {
  try {
    const docRef = doc(db, TECH_STACK_COLLECTION, "categories");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    
    // Return empty object if not found - user must upload their own tech stacks
    return {};
  } catch (error) {
    console.error("Error fetching tech stacks:", error);
    // Return empty object on error - user must upload their own tech stacks
    return {};
  }
}

export async function saveTechStacks(categories: any) {
  const docRef = doc(db, TECH_STACK_COLLECTION, "categories");
  await setDoc(docRef, categories);
}

export async function addTechToCategory(category: string, tech: string) {
  const categories = await getTechStacks();
  
  if (!categories[category]) {
    categories[category] = [];
  }
  
  if (!categories[category].includes(tech)) {
    categories[category].push(tech);
    await saveTechStacks(categories);
  }
}

export async function removeTechFromCategory(category: string, tech: string) {
  const categories = await getTechStacks();
  
  if (categories[category]) {
    categories[category] = categories[category].filter((t: string) => t !== tech);
    await saveTechStacks(categories);
  }
}
