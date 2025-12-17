import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { EditorData } from "../types";

// Helper function to create favicon from avatar with rounded corners
async function createFavicon(avatarDataUrl: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // Create canvas for favicon (512x512 for better quality, will be saved as PNG)
            const canvas = document.createElement('canvas');
            const size = 512;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            // Clear canvas
            ctx.clearRect(0, 0, size, size);

            // Create rounded rectangle path
            const radius = size * 0.2; // 20% radius for rounded corners
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(size - radius, 0);
            ctx.quadraticCurveTo(size, 0, size, radius);
            ctx.lineTo(size, size - radius);
            ctx.quadraticCurveTo(size, size, size - radius, size);
            ctx.lineTo(radius, size);
            ctx.quadraticCurveTo(0, size, 0, size - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.closePath();
            ctx.clip();

            // Draw image centered and cropped to square
            const imgSize = Math.min(img.width, img.height);
            const x = (img.width - imgSize) / 2;
            const y = (img.height - imgSize) / 2;

            ctx.drawImage(img, x, y, imgSize, imgSize, 0, 0, size, size);

            // Convert to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create favicon blob'));
                }
            }, 'image/png');
        };
        img.onerror = () => reject(new Error('Failed to load avatar image'));
        img.src = avatarDataUrl;
    });
}

export async function generateZip(data: EditorData) {
    const zip = new JSZip();

    // Create data folder
    const dataFolder = zip.folder("data");
    if (!dataFolder) throw new Error("Failed to create data folder");

    // Add JSON files
    dataFolder.file("about.json", JSON.stringify(data.about, null, 2));
    dataFolder.file("contact.json", JSON.stringify(data.contact, null, 2));
    dataFolder.file("social.json", JSON.stringify(data.social, null, 2));

    // Projects JSON - Only top 6 images per project
    const projectsForJson = {
        projects: data.projects.projects.map(project => ({
            ...project,
            images: project.images.slice(0, 6) // Only top 6 images
        }))
    };
    dataFolder.file("projects.json", JSON.stringify(projectsForJson, null, 2));

    // Gallery JSON - All images
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

    // Generate and add favicon from avatar
    if (data.about.personal.avatar) {
        try {
            const faviconBlob = await createFavicon(data.about.personal.avatar);
            assetsFolder.file("favicon.png", faviconBlob);
        } catch (error) {
            console.error("Failed to generate favicon:", error);
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
