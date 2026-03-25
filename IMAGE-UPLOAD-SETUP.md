# Image Upload Setup Guide

## Overview
The create listing feature now supports real image uploads to the server. Uploaded images are saved to the `images/` directory.

## Client-Side Implementation
✅ Already implemented in `js/create.js`
- Uploads image file via POST to `/api/upload`
- Receives image URL from server
- Fallback to `images/bike.jpg` if upload fails or no file selected

## Server-Side Requirements

### 1. Install Dependencies
```bash
npm install express multer
```

### 2. Implement Upload Endpoint
See `server-upload-example.js` for complete implementation.

The server must:
- Accept POST requests at `/api/upload`
- Handle multipart/form-data with field name `image`
- Validate file type (jpeg, jpg, png, gif, webp)
- Limit file size (recommended: 5MB max)
- Save files to `images/` directory with unique filenames
- Return JSON response:
  ```json
  {
    "success": true,
    "imageUrl": "images/item-1234567890-123456789.jpg"
  }
  ```

### 3. File Naming Convention
Uploaded files are saved as:
```
images/item-[timestamp]-[random].jpg
```
Example: `images/item-1710345678-987654321.jpg`

### 4. Response Format

**Success:**
```json
{
  "success": true,
  "imageUrl": "images/item-1710345678-987654321.jpg",
  "message": "Image uploaded successfully"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Testing

### Without Server
If the server is not running or upload fails:
- Image upload will fail gracefully
- Fallback to `images/bike.jpg` as placeholder
- Item creation will still work

### With Server
1. Start your server with upload endpoint
2. Access `create-listing.html?user=1002`
3. Fill in the form and select an image
4. Submit the form
5. Check `images/` directory for the uploaded file

## Security Considerations

1. **File Type Validation**: Only allow image files
2. **File Size Limit**: Prevent large uploads (5MB recommended)
3. **Filename Sanitization**: Use generated names, not user input
4. **Directory Permissions**: Ensure `images/` is writable
5. **Virus Scanning**: Consider adding antivirus scanning for production

## Integration with Existing Server

If you already have a Node.js server, add the upload endpoint from `server-upload-example.js` to your existing server code.

Make sure the server serves static files from the `images/` directory so uploaded images are accessible via HTTP.
