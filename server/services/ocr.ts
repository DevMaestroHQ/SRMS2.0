import { createWorker } from "tesseract.js";
import fs from "fs";
import path from "path";

export interface OCRResult {
  name: string;
  tuRegd: string;
  result: string;
  grade?: string;
  marks?: number;
  totalMarks?: number;
  subject?: string;
  program?: string;
  faculty?: string;
}

export class OCRService {
  static async extractDataFromJPG(imageBuffer: Buffer, filename: string): Promise<OCRResult> {
    try {
      console.log(`Starting enhanced OCR processing for ${filename}...`);
      
      // Enhanced OCR processing with better configuration
      const worker = await createWorker();
      
      try {
        // Configure worker for better accuracy
        await worker.setParameters({
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -+/:.,()[]',
          tessedit_pageseg_mode: '6', // Uniform block of text
          tessedit_ocr_engine_mode: '3', // Default, based on what is available
        });

        const { data: { text } } = await worker.recognize(imageBuffer);
        console.log("Extracted text from JPG:", text.substring(0, 500) + "...");
        
        // Extract comprehensive student information
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
    
    // Enhanced patterns for comprehensive information extraction
    const patterns = {
      // Name patterns - more flexible for JPG OCR
      name: [
        /(?:name|student\s*name|full\s*name)\s*:?\s*([a-zA-Z\s.]+?)(?:\n|reg|roll|t\.u|marks|grade|result|subject|program|faculty|$)/i,
        /name\s*[-:]\s*([a-zA-Z\s.]+?)(?:\n|reg|roll|t\.u|marks|grade|result|$)/i,
        /student\s*[-:]\s*([a-zA-Z\s.]+?)(?:\n|reg|roll|t\.u|marks|grade|result|$)/i,
        /^([A-Z][a-zA-Z\s.]{5,40})(?:\s|$)/m, // First capitalized line that looks like a name
      ],
      
      // T.U. Registration patterns - enhanced for various formats
      tuRegd: [
        /(?:t\.?u\.?\s*reg(?:d|istration)?\.?\s*no\.?|registration\s*no\.?|reg\.?\s*no\.?)\s*:?\s*([0-9\-\/A-Z]+)/i,
        /(?:t\.?u\.?\s*roll\s*no\.?|roll\s*no\.?)\s*:?\s*([0-9\-\/A-Z]+)/i,
        /(?:reg\.?\s*#|registration\s*#)\s*:?\s*([0-9\-\/A-Z]+)/i,
        /([0-9]{1,2}[-\/][0-9]{1,2}[-\/][0-9]{2,4}[-\/][0-9]{2,4}[-\/][0-9]{4})/,
        /([0-9]{1,2}[-\/][0-9]{1,2}[-\/][0-9]{2,4}[-\/][0-9]{2,4})/,
        /([0-9]{8,15})/g, // Generic number pattern for registration
      ],

      // Grade patterns
      grade: [
        /grade\s*:?\s*([a-f][+\-]?)/i,
        /result\s*:?\s*([a-f][+\-]?)/i,
        /([a-f][+\-]?)\s*grade/i,
        /grade\s*obtained\s*:?\s*([a-f][+\-]?)/i,
      ],

      // Marks patterns
      marks: [
        /marks\s*:?\s*([0-9]+)(?:\s*\/\s*([0-9]+))?/i,
        /score\s*:?\s*([0-9]+)(?:\s*\/\s*([0-9]+))?/i,
        /obtained\s*:?\s*([0-9]+)(?:\s*out\s*of\s*([0-9]+))?/i,
        /([0-9]+)\s*\/\s*([0-9]+)\s*marks/i,
        /marks\s*obtained\s*:?\s*([0-9]+)/i,
      ],

      // Subject patterns
      subject: [
        /subject\s*:?\s*([a-zA-Z\s&]{3,50})(?:\s*(?:marks|grade|result|program|faculty|$))/i,
        /course\s*:?\s*([a-zA-Z\s&]{3,50})(?:\s*(?:marks|grade|result|program|faculty|$))/i,
        /paper\s*:?\s*([a-zA-Z\s&]{3,50})(?:\s*(?:marks|grade|result|program|faculty|$))/i,
        /examination\s*in\s*:?\s*([a-zA-Z\s&]{3,50})(?:\s*(?:marks|grade|result|$))/i,
      ],

      // Program patterns
      program: [
        /program\s*:?\s*([a-zA-Z\s\.&]{3,50})(?:\s*(?:faculty|result|grade|marks|$))/i,
        /degree\s*:?\s*([a-zA-Z\s\.&]{3,50})(?:\s*(?:faculty|result|grade|marks|$))/i,
        /course\s*:?\s*([a-zA-Z\s\.&]{3,50})(?:\s*(?:faculty|result|grade|marks|$))/i,
        /(bachelor|master|phd|b\.a|m\.a|b\.sc|m\.sc|b\.tech|m\.tech|bba|mba|b\.ed|m\.ed)[a-zA-Z\s\.]*/i,
      ],

      // Faculty patterns
      faculty: [
        /faculty\s*:?\s*([a-zA-Z\s&]{3,50})(?:\s*(?:result|grade|marks|program|$))/i,
        /department\s*:?\s*([a-zA-Z\s&]{3,50})(?:\s*(?:result|grade|marks|program|$))/i,
        /school\s*:?\s*([a-zA-Z\s&]{3,50})(?:\s*(?:result|grade|marks|program|$))/i,
        /institute\s*:?\s*([a-zA-Z\s&]{3,50})(?:\s*(?:result|grade|marks|program|$))/i,
      ],
    };

    let name = "";
    let tuRegd = "";
    let grade: string | undefined;
    let marks: number | undefined;
    let totalMarks: number | undefined;
    let subject: string | undefined;
    let program: string | undefined;
    let faculty: string | undefined;

    // Extract name
    for (const pattern of patterns.name) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        let extractedName = match[1].trim().replace(/\s+/g, ' ');
        extractedName = extractedName.replace(/[^a-zA-Z\s.]/g, '').trim();
        if (extractedName.length > 3 && extractedName.length < 50) {
          name = extractedName;
          break;
        }
      }
    }

    // Extract T.U. registration
    for (const pattern of patterns.tuRegd) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        const extractedReg = match[1].trim();
        if (extractedReg.length > 3) {
          tuRegd = extractedReg;
          break;
        }
      }
    }

    // Extract grade
    for (const pattern of patterns.grade) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        grade = match[1].toUpperCase();
        break;
      }
    }

    // Extract marks
    for (const pattern of patterns.marks) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        marks = parseInt(match[1]);
        if (match[2]) {
          totalMarks = parseInt(match[2]);
        }
        break;
      }
    }

    // Extract subject
    for (const pattern of patterns.subject) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        subject = match[1].trim().replace(/\s+/g, ' ');
        break;
      }
    }

    // Extract program
    for (const pattern of patterns.program) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        program = match[1].trim().replace(/\s+/g, ' ');
        break;
      }
    }

    // Extract faculty
    for (const pattern of patterns.faculty) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        faculty = match[1].trim().replace(/\s+/g, ' ');
        break;
      }
    }

    // Determine result with enhanced logic
    let result = "Unknown";
    
    // Check for explicit pass/fail indicators
    const resultPatterns = [
      /result\s*:?\s*(pass|passed|fail|failed|clear|cleared)/i,
      /status\s*:?\s*(pass|passed|fail|failed|clear|cleared)/i,
      /(pass|passed|fail|failed|clear|cleared)/i,
    ];

    for (const pattern of resultPatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        const resultText = match[1].toLowerCase();
        result = (resultText.includes('pass') || resultText.includes('clear')) ? 'Passed' : 'Failed';
        break;
      }
    }

    // Smart result inference from grade and marks
    if (result === "Unknown") {
      if (grade) {
        result = (grade === 'F' || grade === 'F+' || grade === 'F-') ? 'Failed' : 'Passed';
      } else if (marks && totalMarks) {
        const percentage = (marks / totalMarks) * 100;
        result = percentage >= 40 ? 'Passed' : 'Failed';
      } else if (normalizedText.toLowerCase().includes('pass') || normalizedText.toLowerCase().includes('clear')) {
        result = 'Passed';
      } else if (normalizedText.toLowerCase().includes('fail')) {
        result = 'Failed';
      } else {
        result = 'Passed'; // Default assumption
      }
    }

    return {
      name: name || "Name not found",
      tuRegd: tuRegd || "Registration not found",
      result,
      grade,
      marks,
      totalMarks,
      subject,
      program,
      faculty
    };
  }
}