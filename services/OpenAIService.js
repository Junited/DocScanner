import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@env';

class OpenAIService {
  constructor() {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set. Please add it to your .env file.');
    }
    
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
  }

  /**
   * Analyze document image and extract structured data with multi-language support
   * @param {string} base64Image - Base64 encoded image
   * @returns {Object} Structured document data
   */
  async analyzeDocument(base64Image) {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an advanced document analysis AI with multi-language OCR capabilities. Your task is to:
1. Identify the document type (passport, ID card, receipt, invoice, business card, contract, medical prescription, etc.)
2. Extract ALL text from the document in its original language
3. Detect the language(s) present in the document
4. Structure the extracted data according to the document type
5. Provide confidence scores for extracted fields

For each document type, use this structure:

PASSPORT:
{
  "documentType": "passport",
  "confidence": 0.95,
  "languages": ["language1", "language2"],
  "data": {
    "type": "PASSPORT",
    "country": "country name",
    "passportNumber": "number",
    "surname": "surname",
    "givenNames": "given names",
    "nationality": "nationality",
    "dateOfBirth": "DD MMM YYYY",
    "sex": "M/F",
    "placeOfBirth": "place",
    "dateOfIssue": "DD MMM YYYY",
    "dateOfExpiry": "DD MMM YYYY",
    "authority": "issuing authority",
    "mrzLine1": "line 1",
    "mrzLine2": "line 2"
  },
  "rawText": "all extracted text",
  "additionalInfo": "any other relevant information"
}

ID CARD:
{
  "documentType": "id_card",
  "confidence": 0.95,
  "languages": ["language"],
  "data": {
    "type": "ID CARD",
    "idNumber": "number",
    "fullName": "name",
    "dateOfBirth": "DD MMM YYYY",
    "sex": "M/F",
    "nationality": "nationality",
    "address": "address",
    "dateOfIssue": "DD MMM YYYY",
    "dateOfExpiry": "DD MMM YYYY"
  },
  "rawText": "all extracted text",
  "additionalInfo": "any other information"
}

RECEIPT:
{
  "documentType": "receipt",
  "confidence": 0.95,
  "languages": ["language"],
  "data": {
    "type": "RECEIPT",
    "merchantName": "name",
    "merchantAddress": "address",
    "merchantPhone": "phone",
    "date": "DD MMM YYYY",
    "time": "HH:MM",
    "items": [
      {
        "name": "item name",
        "quantity": 1,
        "price": 0.00,
        "total": 0.00
      }
    ],
    "subtotal": 0.00,
    "tax": 0.00,
    "total": 0.00,
    "currency": "USD",
    "paymentMethod": "method"
  },
  "rawText": "all extracted text",
  "additionalInfo": "any other information"
}

INVOICE:
{
  "documentType": "invoice",
  "confidence": 0.95,
  "languages": ["language"],
  "data": {
    "type": "INVOICE",
    "invoiceNumber": "number",
    "date": "DD MMM YYYY",
    "dueDate": "DD MMM YYYY",
    "vendor": {
      "name": "vendor name",
      "address": "address",
      "phone": "phone",
      "email": "email"
    },
    "billTo": {
      "name": "customer name",
      "address": "address"
    },
    "items": [
      {
        "description": "item",
        "quantity": 1,
        "unitPrice": 0.00,
        "total": 0.00
      }
    ],
    "subtotal": 0.00,
    "tax": 0.00,
    "total": 0.00,
    "currency": "USD"
  },
  "rawText": "all extracted text",
  "additionalInfo": "any other information"
}

BUSINESS CARD:
{
  "documentType": "business_card",
  "confidence": 0.95,
  "languages": ["language"],
  "data": {
    "type": "BUSINESS CARD",
    "name": "full name",
    "title": "job title",
    "company": "company name",
    "phone": "phone",
    "email": "email",
    "website": "website",
    "address": "address"
  },
  "rawText": "all extracted text",
  "additionalInfo": "any other information"
}

DRIVER LICENSE:
{
  "documentType": "driver_license",
  "confidence": 0.95,
  "languages": ["language"],
  "data": {
    "type": "DRIVER LICENSE",
    "licenseNumber": "number",
    "fullName": "name",
    "address": "address",
    "dateOfBirth": "DD MMM YYYY",
    "sex": "M/F",
    "height": "height",
    "eyeColor": "color",
    "dateOfIssue": "DD MMM YYYY",
    "dateOfExpiry": "DD MMM YYYY",
    "class": "license class",
    "restrictions": "restrictions",
    "endorsements": "endorsements"
  },
  "rawText": "all extracted text",
  "additionalInfo": "any other information"
}

MEDICAL PRESCRIPTION:
{
  "documentType": "prescription",
  "confidence": 0.95,
  "languages": ["language"],
  "data": {
    "type": "MEDICAL PRESCRIPTION",
    "patientName": "name",
    "patientDOB": "DD MMM YYYY",
    "doctorName": "doctor name",
    "clinicName": "clinic/hospital",
    "date": "DD MMM YYYY",
    "medications": [
      {
        "name": "medication name",
        "dosage": "dosage",
        "frequency": "frequency",
        "duration": "duration",
        "instructions": "special instructions"
      }
    ]
  },
  "rawText": "all extracted text",
  "additionalInfo": "any other information"
}

CONTRACT:
{
  "documentType": "contract",
  "confidence": 0.95,
  "languages": ["language"],
  "data": {
    "type": "CONTRACT",
    "title": "contract title",
    "date": "DD MMM YYYY",
    "parties": [
      {
        "name": "party name",
        "role": "role (e.g., contractor, client)"
      }
    ],
    "effectiveDate": "DD MMM YYYY",
    "expiryDate": "DD MMM YYYY",
    "keyTerms": ["term1", "term2"]
  },
  "rawText": "all extracted text",
  "additionalInfo": "any other information"
}

GENERIC DOCUMENT (if none of the above):
{
  "documentType": "generic",
  "confidence": 0.95,
  "languages": ["language"],
  "data": {
    "type": "DOCUMENT",
    "title": "detected title if any",
    "summary": "brief summary of content"
  },
  "rawText": "all extracted text",
  "additionalInfo": "any other information"
}

IMPORTANT:
- Detect and preserve text in ANY language (English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, etc.)
- Use the native language for the rawText field
- Provide translations in additionalInfo if helpful
- Be as accurate as possible with data extraction
- Include confidence scores
- Handle multi-language documents
- Return ONLY valid JSON, no additional text or markdown`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this document, identify its type, extract all text (in any language), and structure the data accordingly. Return ONLY the JSON object, nothing else."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 4096,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      
      // Extract JSON from the response (in case GPT includes extra text)
      let jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const result = JSON.parse(jsonMatch[0]);
      
      // Add metadata
      result.analyzedAt = new Date().toISOString();
      result.model = "gpt-4o";
      
      return result;
    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      throw new Error(`Failed to analyze document: ${error.message}`);
    }
  }

  /**
   * Enhance or correct extracted data
   * @param {Object} documentData - Previously extracted data
   * @param {string} userCorrections - User's corrections or additional info
   */
  async enhanceData(documentData, userCorrections) {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a document data enhancement assistant. Update the provided document data based on user corrections. Return ONLY the updated JSON object."
          },
          {
            role: "user",
            content: `Original data:\n${JSON.stringify(documentData, null, 2)}\n\nUser corrections:\n${userCorrections}\n\nPlease update the data accordingly and return the complete updated JSON object.`
          }
        ],
        max_tokens: 2048,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      let jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Enhancement Error:', error);
      throw new Error(`Failed to enhance data: ${error.message}`);
    }
  }

  /**
   * Translate document text to target language
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language
   */
  async translateText(text, targetLanguage) {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Translate the following text to ${targetLanguage}. Preserve formatting and structure.`
          },
          {
            role: "user",
            content: text
          }
        ],
        max_tokens: 2048,
        temperature: 0.3,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Translation Error:', error);
      throw error;
    }
  }
}

export default new OpenAIService();
