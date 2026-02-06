# Audio Files Setup Instructions

## Directory Structure

To use local audio files instead of Dropbox URLs, organize your MP3 files like this:

```
/public/audio/
├── 1/  (Root Chakra)
│   ├── track-1.mp3
│   ├── track-2.mp3
│   ├── track-3.mp3
│   ├── track-4.mp3
│   ├── track-5.mp3
│   ├── track-6.mp3
│   ├── track-7.mp3
│   ├── track-8.mp3
│   └── track-9.mp3
├── 2/  (Sacral Chakra)
│   ├── track-1.mp3
│   ├── track-2.mp3
│   └── ... (9 tracks total)
├── 3/  (Solar Plexus Chakra)
│   └── ... (9 tracks)
├── 4/  (Heart Chakra)
│   └── ... (9 tracks)
├── 5/  (Throat Chakra)
│   └── ... (9 tracks)
├── 6/  (Third Eye Chakra)
│   └── ... (9 tracks)
└── 7/  (Crown Chakra)
    └── ... (9 tracks)
```

## How to Add Your Audio Files

### Step 1: Download Your Audio from Dropbox
Since your files are currently on Dropbox, download all 63 MP3 files to your computer.

### Step 2: Create Chakra Folders
In the `/public/audio/` directory, create 7 folders named:
- `1` (for Root Chakra)
- `2` (for Sacral Chakra)
- `3` (for Solar Plexus Chakra)
- `4` (for Heart Chakra)
- `5` (for Throat Chakra)
- `6` (for Third Eye Chakra)
- `7` (for Crown Chakra)

### Step 3: Rename and Place Files
For each chakra:
1. Take the 9 audio files for that chakra
2. Rename them to: `track-1.mp3`, `track-2.mp3`, ... `track-9.mp3`
3. Place them in the corresponding chakra folder

### Step 4: Update the Configuration
After placing all files, you need to update `/src/config/audioConfig.ts`:

Change the last line from:
```typescript
export const USE_EXTERNAL_URLS = true;
```

To:
```typescript
export const USE_EXTERNAL_URLS = false;
```

## Verification

After setup, you should have:
- 7 folders (numbered 1-7)
- 9 MP3 files in each folder
- Total: 63 audio files
- Configuration set to use local files

## File Size Considerations

- Each MP3 file size varies, but typical meditation tracks are 5-15 MB each
- 63 files × ~10 MB average = ~630 MB total
- The PWA will cache files as they're played for offline use
- First load will download all files when you switch between chakras

## Testing

1. Make sure all files are in place
2. Set `USE_EXTERNAL_URLS = false` in audioConfig.ts
3. Refresh the app
4. Select a chakra and press play
5. Check browser console for any loading errors

## Troubleshooting

If audio doesn't play:
- Check browser console for 404 errors
- Verify file names match exactly (case-sensitive)
- Ensure files are in the correct folders
- Make sure files are actual MP3 format
- Check that `USE_EXTERNAL_URLS` is set to `false`
