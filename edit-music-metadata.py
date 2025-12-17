#!/usr/bin/env python3
"""
Music Metadata Editor
Edit and save metadata directly to music files
Supports: MP3, M4A, FLAC, OGG
"""

import os
import sys
from pathlib import Path

try:
    from mutagen.mp3 import MP3
    from mutagen.mp4 import MP4
    from mutagen.flac import FLAC
    from mutagen.oggvorbis import OggVorbis
    from mutagen.id3 import ID3, TIT2, TPE1, TALB, APIC
except ImportError:
    print("❌ Error: 'mutagen' library not found!")
    print("\n📦 Install it using:")
    print("   pip install mutagen")
    print("\nOr:")
    print("   python -m pip install mutagen")
    sys.exit(1)


def clear_screen():
    """Clear the terminal screen"""
    os.system('cls' if os.name == 'nt' else 'clear')


def print_header():
    """Print the header"""
    print("=" * 60)
    print("🎵  MUSIC METADATA EDITOR  🎵")
    print("=" * 60)
    print()


def get_metadata(file_path):
    """Get metadata from audio file"""
    ext = file_path.suffix.lower()
    
    try:
        if ext == '.mp3':
            audio = MP3(file_path, ID3=ID3)
            return {
                'title': str(audio.get('TIT2', [''])[0]) if 'TIT2' in audio else '',
                'artist': str(audio.get('TPE1', [''])[0]) if 'TPE1' in audio else '',
                'album': str(audio.get('TALB', [''])[0]) if 'TALB' in audio else '',
                'type': 'mp3'
            }
        elif ext in ['.m4a', '.mp4']:
            audio = MP4(file_path)
            return {
                'title': audio.get('\xa9nam', [''])[0] if '\xa9nam' in audio else '',
                'artist': audio.get('\xa9ART', [''])[0] if '\xa9ART' in audio else '',
                'album': audio.get('\xa9alb', [''])[0] if '\xa9alb' in audio else '',
                'type': 'm4a'
            }
        elif ext == '.flac':
            audio = FLAC(file_path)
            return {
                'title': audio.get('title', [''])[0],
                'artist': audio.get('artist', [''])[0],
                'album': audio.get('album', [''])[0],
                'type': 'flac'
            }
        elif ext == '.ogg':
            audio = OggVorbis(file_path)
            return {
                'title': audio.get('title', [''])[0],
                'artist': audio.get('artist', [''])[0],
                'album': audio.get('album', [''])[0],
                'type': 'ogg'
            }
        else:
            return None
    except Exception as e:
        print(f"❌ Error reading {file_path.name}: {e}")
        return None


def save_metadata(file_path, metadata):
    """Save metadata to audio file"""
    ext = file_path.suffix.lower()
    
    try:
        if ext == '.mp3':
            audio = MP3(file_path, ID3=ID3)
            if audio.tags is None:
                audio.add_tags()
            
            audio.tags['TIT2'] = TIT2(encoding=3, text=metadata['title'])
            audio.tags['TPE1'] = TPE1(encoding=3, text=metadata['artist'])
            audio.tags['TALB'] = TALB(encoding=3, text=metadata['album'])
            audio.save()
            
        elif ext in ['.m4a', '.mp4']:
            audio = MP4(file_path)
            audio['\xa9nam'] = metadata['title']
            audio['\xa9ART'] = metadata['artist']
            audio['\xa9alb'] = metadata['album']
            audio.save()
            
        elif ext == '.flac':
            audio = FLAC(file_path)
            audio['title'] = metadata['title']
            audio['artist'] = metadata['artist']
            audio['album'] = metadata['album']
            audio.save()
            
        elif ext == '.ogg':
            audio = OggVorbis(file_path)
            audio['title'] = metadata['title']
            audio['artist'] = metadata['artist']
            audio['album'] = metadata['album']
            audio.save()
            
        return True
    except Exception as e:
        print(f"❌ Error saving {file_path.name}: {e}")
        return False


def edit_file(file_path):
    """Edit metadata for a single file"""
    print(f"\n📁 File: {file_path.name}")
    print("-" * 60)
    
    metadata = get_metadata(file_path)
    if metadata is None:
        print("❌ Unsupported file format!")
        return False
    
    print(f"\n📝 Current Metadata:")
    print(f"   Title:  {metadata['title'] or '(empty)'}")
    print(f"   Artist: {metadata['artist'] or '(empty)'}")
    print(f"   Album:  {metadata['album'] or '(empty)'}")
    
    print(f"\n✏️  Edit Metadata (press Enter to keep current value):")
    
    new_title = input(f"   Title  [{metadata['title']}]: ").strip()
    new_artist = input(f"   Artist [{metadata['artist']}]: ").strip()
    new_album = input(f"   Album  [{metadata['album']}]: ").strip()
    
    # Use new values or keep old ones
    metadata['title'] = new_title if new_title else metadata['title']
    metadata['artist'] = new_artist if new_artist else metadata['artist']
    metadata['album'] = new_album if new_album else metadata['album']
    
    print(f"\n💾 Saving changes...")
    if save_metadata(file_path, metadata):
        print(f"✅ Successfully saved!")
        return True
    else:
        return False


def batch_edit_folder(folder_path):
    """Edit all music files in a folder"""
    music_files = []
    for ext in ['.mp3', '.m4a', '.mp4', '.flac', '.ogg']:
        music_files.extend(folder_path.glob(f'*{ext}'))
    
    if not music_files:
        print("❌ No music files found in this folder!")
        return
    
    print(f"\n📂 Found {len(music_files)} music file(s)")
    print("-" * 60)
    
    for i, file_path in enumerate(music_files, 1):
        print(f"\n[{i}/{len(music_files)}] {file_path.name}")
        
        metadata = get_metadata(file_path)
        if metadata is None:
            print("   ⚠️  Skipped (unsupported format)")
            continue
        
        print(f"   Current: {metadata['title']} - {metadata['artist']}")
        
        choice = input("   Edit this file? (y/n/q): ").lower()
        
        if choice == 'q':
            print("\n👋 Exiting...")
            break
        elif choice == 'y':
            edit_file(file_path)
        else:
            print("   ⏭️  Skipped")


def main():
    """Main function"""
    clear_screen()
    print_header()
    
    print("Choose an option:")
    print("1. Edit a single file")
    print("2. Edit all files in a folder")
    print("3. Exit")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == '1':
        file_path = input("\n📁 Enter file path: ").strip().strip('"')
        file_path = Path(file_path)
        
        if not file_path.exists():
            print("❌ File not found!")
            return
        
        if not file_path.is_file():
            print("❌ Not a file!")
            return
        
        edit_file(file_path)
        
    elif choice == '2':
        folder_path = input("\n📂 Enter folder path: ").strip().strip('"')
        folder_path = Path(folder_path)
        
        if not folder_path.exists():
            print("❌ Folder not found!")
            return
        
        if not folder_path.is_dir():
            print("❌ Not a folder!")
            return
        
        batch_edit_folder(folder_path)
        
    elif choice == '3':
        print("\n👋 Goodbye!")
        return
    else:
        print("❌ Invalid choice!")
        return
    
    print("\n" + "=" * 60)
    print("✅ Done!")
    print("=" * 60)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Interrupted by user. Goodbye!")
        sys.exit(0)
