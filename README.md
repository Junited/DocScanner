# Document Scanner Mobile App

A beautiful and modern document scanner mobile application built with React Native and Expo SDK 54.

## Features

### 📱 Dashboard Screen
- Welcome header with user greeting
- Large, prominent scan button with beautiful gradient design
- Quick action buttons (Gallery, Import PDF, Share)
- Recent scans preview section
- Activity statistics card showing total scans, pages scanned, and weekly activity
- Modern, clean UI with smooth animations

### 📚 History Screen
- Comprehensive list of all scanned documents
- Search functionality to quickly find documents
- Filter pills for organizing documents (All, Recent, Invoice, Receipt, Contract)
- Document cards with:
  - Preview thumbnails
  - Page count badges
  - Category tags with color coding
  - Date and time metadata
  - File size information
  - Quick action buttons (Share, More options)
- Sort functionality
- Floating action button for quick scanning
- Empty state design

## Tech Stack

- **Framework**: React Native 0.81.5
- **Platform**: Expo SDK 54
- **Navigation**: React Navigation 7.x (Bottom Tabs)
- **Icons**: @expo/vector-icons
- **UI**: Custom styled components with modern design principles

## Project Structure

```
scanner/
├── screens/
│   ├── DashboardScreen.js    # Main dashboard with scan button
│   └── HistoryScreen.js       # Document history and management
├── assets/                    # App icons and images
├── App.js                     # Main navigation setup
├── index.js                   # Entry point
└── package.json              # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

4. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## Design Features

### Color Scheme
- Primary: `#6366F1` (Indigo)
- Background: `#F8F9FA` (Light Gray)
- Text Primary: `#1A1A1A` (Dark)
- Text Secondary: `#666666` (Gray)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)

### UI Components
- **Cards**: Rounded corners (16-24px), subtle shadows
- **Buttons**: Modern, touch-friendly design with proper feedback
- **Typography**: Clear hierarchy with proper font weights
- **Spacing**: Consistent padding and margins
- **Icons**: Material Design and Ionicons for consistency

## Status

✅ **Frontend Design Complete**
- Dashboard UI fully designed
- History UI fully designed
- Navigation structure implemented
- Modern, responsive design
- Beautiful color scheme and typography

🚧 **Pending (Not Implemented)**
- Camera/scanning functionality
- Document processing
- PDF generation
- Cloud storage integration
- Document sharing functionality
- Search and filter logic
- Data persistence

## Notes

This is a **frontend-only** implementation. All data shown is mock data for design purposes. The actual scanning functionality, document processing, and data management features are not yet implemented.

## Screenshots

The app includes two main screens:

1. **Dashboard**: Clean, welcoming interface with a prominent scan button, quick actions, recent scans preview, and activity statistics.

2. **History**: Comprehensive document management view with search, filters, and detailed document cards.

## Future Enhancements

- Camera integration with document edge detection
- OCR (Optical Character Recognition)
- PDF export functionality
- Cloud sync (Google Drive, Dropbox)
- Document categorization
- Batch scanning
- Document editing tools
- Annotations and signatures

## License

MIT License - feel free to use this project for learning or as a starting point for your own document scanner app.
