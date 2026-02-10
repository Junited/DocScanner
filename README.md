# DocScanner - AI-Powered Document Scanner

An advanced document scanning mobile application built with React Native and Expo, powered by OpenAI's GPT-4o Vision API for intelligent document recognition and data extraction.

## Features

### 🚀 Advanced AI-Powered Scanning
- **Multi-Language OCR**: Automatically detects and extracts text in any language (English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, etc.)
- **Intelligent Document Type Detection**: Automatically identifies document types including:
  - Passports
  - ID Cards / Driver Licenses
  - Receipts
  - Invoices
  - Business Cards
  - Medical Prescriptions
  - Contracts
  - Generic Documents

### 📄 Structured Data Extraction
- Extracts and structures data according to document type
- Custom formatting for each document type with relevant fields
- Confidence scoring for extracted information
- Language detection and multi-language support

### ✨ User Experience
- **Real-time Preview**: Preview extracted data before saving
- **Edit Mode**: Manually correct or edit extracted data
- **Document History**: View and manage all scanned documents
- **Search & Filter**: Easily find documents by content, type, or date
- **Beautiful UI**: Modern, intuitive interface with smooth animations

### 🔧 Technical Features
- Built with React Native & Expo
- OpenAI GPT-4o Vision API integration
- Local storage with AsyncStorage
- Camera integration with permission handling
- Gallery import support
- Structured data models for different document types

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for macOS) or Android Emulator
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DocScanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the app**
   
   For iOS:
   ```bash
   npm run ios
   ```
   
   For Android:
   ```bash
   npm run android
   ```
   
   For Web:
   ```bash
   npm run web
   ```

## Project Structure

```
DocScanner/
├── screens/
│   ├── DashboardScreen.js      # Main scanning interface
│   ├── HistoryScreen.js        # Document history and management
│   └── DocumentPreviewScreen.js # AI analysis results and editing
├── services/
│   ├── OpenAIService.js        # OpenAI API integration
│   └── StorageService.js       # Local document storage
├── assets/                     # Images and icons
├── App.js                      # Main app component with navigation
├── .env                        # Environment variables (not in git)
└── package.json               # Dependencies

```

## How It Works

1. **Capture Document**: Use the camera or select from gallery
2. **AI Analysis**: Image is sent to OpenAI GPT-4o Vision API
3. **Data Extraction**: AI identifies document type and extracts structured data
4. **Preview & Edit**: Review extracted data, make corrections if needed
5. **Save**: Store document locally with all metadata
6. **Manage**: View, search, and manage all saved documents

## Document Types & Fields

### Passport
- Country, Passport Number, Name, Nationality
- Date of Birth, Sex, Place of Birth
- Issue/Expiry Dates, Authority
- MRZ (Machine Readable Zone) lines

### ID Card / Driver License
- ID/License Number, Full Name
- Address, Date of Birth, Sex
- Issue/Expiry Dates, Additional fields

### Receipt
- Merchant details (name, address, phone)
- Date, Time, Items with prices
- Subtotal, Tax, Total, Payment method

### Invoice
- Invoice number, Dates (issue, due)
- Vendor and Customer details
- Line items with quantities and prices
- Subtotal, Tax, Total

### Business Card
- Name, Title, Company
- Contact information (phone, email, website)
- Address

### Medical Prescription
- Patient details, Doctor information
- Medications with dosage, frequency, duration
- Special instructions

### Contract
- Title, Parties involved
- Effective/Expiry dates
- Key terms and conditions

## API Usage

The app uses OpenAI's GPT-4o model with vision capabilities:
- High-quality image analysis
- Structured JSON output
- Multi-language support
- Context-aware data extraction

## Privacy & Security

- All data is stored locally on the device
- Images and extracted data are not stored on external servers (except during AI analysis)
- OpenAI API usage follows their data retention policies
- API keys should be kept secure and never committed to version control

## Future Enhancements

- [ ] PDF generation and export
- [ ] Cloud backup integration
- [ ] OCR quality improvements
- [ ] Batch document processing
- [ ] Document categorization and tagging
- [ ] Advanced search capabilities
- [ ] Multi-page document support
- [ ] Document sharing options

## Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **OpenAI GPT-4o** - AI-powered document analysis
- **AsyncStorage** - Local data persistence
- **React Navigation** - Navigation library
- **Expo Camera** - Camera integration
- **Expo Image Picker** - Gallery access

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues, questions, or contributions, please open an issue in the repository.

---

Built with ❤️ using React Native, Expo, and OpenAI
