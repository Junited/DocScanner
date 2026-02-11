# Sharing Features Documentation

## Overview
The DocScanner app now includes comprehensive sharing functionality that allows users to share scanned documents from multiple locations throughout the app.

## Features Implemented

### 1. **SharingService** (`services/SharingService.js`)
A centralized service that handles all sharing operations:

#### Methods:
- **`shareImage(imageUri, documentName)`** - Share the document image
- **`shareDocument(document)`** - Share complete document with metadata
- **`shareDocumentData(documentData)`** - Share extracted data as JSON
- **`shareText(text, title)`** - Share extracted text as a text file
- **`showShareOptions(document, callback)`** - Display sharing options menu

#### Share Options Menu:
When a user taps share, they get three options:
1. **Share Image** - Shares the scanned document image (JPEG)
2. **Share Extracted Text** - Shares the OCR-extracted text as a .txt file
3. **Share Data (JSON)** - Shares all structured data as a .json file

### 2. **Document Preview Screen**
**Location:** After scanning or viewing a saved document

**Features:**
- Share button in the action bar (bottom of screen)
- Share option appears in success dialog after saving
- Options: "Share", "View History", or "Done"
- Users can share before or after saving

**User Flow:**
```
Scan Document → Preview → Save → [Share] [View History] [Done]
                     ↓
                  [Share button] (available before saving too)
```

### 3. **History Screen**
**Location:** History tab - list of all saved documents

**Features:**
- Share button next to each document (blue share icon)
- Tap share icon to open sharing options
- Does not navigate away from list

**User Flow:**
```
History Tab → Document List → [Share Icon] → Share Options Menu
```

### 4. **Dashboard Screen**
**Location:** Home screen - recent scans section

**Features:**
- Share button next to each recent scan
- Live data from stored documents (top 3 most recent)
- Tap document to view details
- Tap share icon for quick sharing
- Empty state when no documents exist

**User Flow:**
```
Dashboard → Recent Scans → [Share Icon] → Share Options Menu
                      ↓
                   [Tap Document] → Preview Screen
```

**Stats:**
- Total scans count updated in real-time
- Recent scans section shows last 3 documents
- "See All" button navigates to History screen

## Technical Implementation

### Dependencies
- `expo-sharing` - Native sharing functionality
- `expo-file-system/legacy` - File operations for creating shareable files

### File Creation
Temporary files are created in the app's cache directory for sharing:
- **Text files:** `text_{timestamp}.txt`
- **JSON files:** `document_data_{timestamp}.json`
- Files are automatically cleaned up after sharing

### Platform Support
- iOS: Native share sheet
- Android: Native share dialog
- Supports sharing to all system-compatible apps

## Usage Examples

### Share from Preview Screen
1. Scan or open a document
2. Tap the **Share** button in the bottom action bar
3. Choose: Image, Text, or JSON
4. Select app to share with

### Share from History
1. Navigate to History tab
2. Find the document to share
3. Tap the blue **share icon** on the right
4. Choose share option
5. Select app to share with

### Share from Dashboard
1. View Recent Scans section
2. Tap the **share icon** next to any recent document
3. Choose share option
4. Select app to share with

### Share After Saving
1. Scan and preview a document
2. Tap **Save**
3. In the success dialog, tap **Share**
4. Choose share option
5. Select app to share with

## Share Options Details

### 1. Share Image
- Format: JPEG
- Quality: Original scan quality
- Use case: Sharing the visual document

### 2. Share Extracted Text
- Format: Plain text (.txt)
- Content: Raw OCR-extracted text in original language
- Use case: Sharing readable text content

### 3. Share Data (JSON)
- Format: JSON (.json)
- Content: Complete structured data including:
  - Document type
  - Extracted fields
  - Confidence scores
  - Languages detected
  - Metadata
  - Raw text
- Use case: Data integration, backup, or analysis

## Error Handling
- Checks if sharing is available on the device
- Shows user-friendly error messages
- Gracefully handles permission denials
- Cleans up temporary files even on errors

## Future Enhancements
- PDF generation with formatted data
- Batch sharing (multiple documents)
- Custom templates for different document types
- Direct sharing to specific services (email, cloud storage)
- Share history tracking
