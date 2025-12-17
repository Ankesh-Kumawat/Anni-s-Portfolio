import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { EditorData } from "../types";

export async function generateZip(data: EditorData) {
    const zip = new JSZip();

    // Create data folder
    const dataFolder = zip.folder("data");
    if (!dataFolder) throw new Error("Failed to create data folder");

    // Add JSON files
    dataFolder.file("about.json", JSON.stringify(data.about, null, 2));
    dataFolder.file("contact.json", JSON.stringify(data.contact, null, 2));
    dataFolder.file("social.json", JSON.stringify(data.social, null, 2));
    dataFolder.file("projects.json", JSON.stringify(data.projects, null, 2));
    dataFolder.file("gallery.json", JSON.stringify(data.gallery, null, 2));
    dataFolder.file("notepad.json", JSON.stringify(data.notepad, null, 2));
    dataFolder.file("terminal.json", JSON.stringify(data.terminal, null, 2));
    dataFolder.file("database.json", JSON.stringify(data.database, null, 2));
    dataFolder.file("settings.json", JSON.stringify(data.settings, null, 2));

    // Create assets folder
    const assetsFolder = zip.folder("assets");
    if (!assetsFolder) throw new Error("Failed to create assets folder");

    // Add images
    if (data.assets.images.length > 0) {
        for (const image of data.assets.images) {
            assetsFolder.file(image.path, image.file);
        }
    }

    // Add music files
    if (data.assets.music.length > 0) {
        const musicFolder = assetsFolder.folder("music");
        if (musicFolder) {
            for (const music of data.assets.music) {
                musicFolder.file(music.name, music.file);
            }
        }
    }

    // Generate and download ZIP
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "portfolio-data.zip");
}
