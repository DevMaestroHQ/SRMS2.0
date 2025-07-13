import { createWorker } from "tesseract.js";
import fs from "fs";
import path from "path";

export interface OCRResult {
  name: string;
  tuRegd: string;
  marks: string;
}

export class OCRService {
  static async extractDataFromJPG(imageBuffer: Buffer, filename: string): Promise<OCRResult> {
    try {
      console.log(`Starting OCR processing for ${filename}...`);
      
      // Perform OCR on JPG image
      const worker = await createWorker();
      
      try {
        const { data: { text } } = await worker.recognize(imageBuffer);
        console.log("Extracted text from JPG:", text.substring(0, 300) + "...");
        
        // Extract student information using regex patterns
        const extractedData = this.extractStudentInfo(text);
        
        if (!extractedData.name || extractedData.name === "Name not found" || 
            !extractedData.tuRegd || extractedData.tuRegd === "Registration not found") {
          throw new Error("Could not extract student information from JPG. Please ensure the image contains clear, readable text with student name and T.U. registration number.");
        }

        return extractedData;
      } finally {
        await worker.terminate();
      }
    } catch (error) {
      console.error("OCR extraction error:", error);
      throw new Error(`Failed to extract data from JPG: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static extractStudentInfo(text: string): OCRResult {
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    
    // Focused patterns for student information extraction from JPG
    const patterns = {
      // Name patterns - more flexible for JPG OCR
      name: [
        /(?:name|student\s*name|full\s*name)\s*:?\s*([a-zA-Z\s.]+?)(?:\n|reg|roll|t\.u|marks|grade|result|$)/i,
        /name\s*[-:]\s*([a-zA-Z\s.]+?)(?:\n|reg|roll|t\.u|marks|$)/i,
        /student\s*[-:]\s*([a-zA-Z\s.]+?)(?:\n|reg|roll|t\.u|marks|$)/i,
        /^([A-Z][a-zA-Z\s.]{5,40})(?:\s|$)/m, // First capitalized line that looks like a name
      ],
      
      // T.U. Registration patterns - focused on common formats
      tuRegd: [
        /(?:t\.?u\.?\s*reg(?:d|istration)?\.?\s*no\.?|registration\s*no\.?|reg\.?\s*no\.?)\s*:?\s*([0-9\-\/A-Z]+)/i,
        /(?:t\.?u\.?\s*roll\s*no\.?|roll\s*no\.?)\s*:?\s*([0-9\-\/A-Z]+)/i,
        /(?:reg\.?\s*#|registration\s*#)\s*:?\s*([0-9\-\/A-Z]+)/i,
        /([0-9]{1,2}[-\/][0-9]{1,2}[-\/][0-9]{2,4}[-\/][0-9]{2,4}[-\/][0-9]{4})/,
        /([0-9]{4,15})/g, // Generic number pattern for registration
      ]
    };

    let name = "";
    let tuRegd = "";

    // Extract name
    for (const pattern of patterns.name) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        let extractedName = match[1].trim().replace(/\s+/g, ' ');
        // Clean up common OCR artifacts
        extractedName = extractedName.replace(/[^a-zA-Z\s.]/g, '').trim();
        if (extractedName.length > 3 && extractedName.length < 50) {
          name = extractedName;
          break;
        }
      }
    }

    // Extract T.U. registration
    for (const pattern of patterns.tuRegd) {
      const matches = normalizedText.matchAll(new RegExp(pattern.source, pattern.flags + 'g'));
      for (const match of matches) {
        if (match && match[1]) {
          const extractedReg = match[1].trim();
          // Prefer longer registration numbers
          if (extractedReg.length >= 5 && extractedReg.length <= 20) {
            tuRegd = extractedReg;
            break;
          }
        }
      }
      if (tuRegd) break;
    }

    // Clean up extracted data
    if (name) {
      name = name.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }

    return {
      name: name || "Name not found",
      tuRegd: tuRegd || "Registration not found", 
      marks: "Not applicable" // Since we're only extracting name and registration
    };
  }
}
